using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using DDDSample1.Domain.Logs;
using System.Text.RegularExpressions; // Ensure you have this using directive for Regex
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Json;
using Newtonsoft.Json;

namespace DDDSample1.Domain.Patients
{
    public class PatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _repo;
        private readonly IPatientMapper _mapper;
        private readonly ILogRepository _logRepository;

        public PatientService(IUnitOfWork unitOfWork, IPatientRepository repo, IPatientMapper mapper, ILogRepository logRepository)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _mapper = mapper;
            _logRepository = logRepository;
        }

        public async Task<PatientDTO> CreatePatient(CreatingPatientDTO dto)
        {
            try
            {
                var patient = _mapper.ToDomain(dto);

                if (await _repo.GetByEmailAsync(patient.Email) != null)
                    throw new BusinessRuleValidationException("A patient with the same email already exists.");

                if (await _repo.GetByPhoneNumberAsync(patient.PhoneNumber) != null)
                    throw new BusinessRuleValidationException("A patient with the same phone number already exists.");

                var list = await _repo.GetAllAsync();
                patient.AssignMedicalRecordNumber(MedicalRecordNumberGenerator.GenerateMedicalRecordNumber(list.Count));
                await _repo.AddAsync(patient);

                var apiSuccess = await CallExternalApi(patient.MedicalRecordNumber, dto.Allergies, dto.MedicalConditions);
                if (apiSuccess == null)
                {
                    throw new Exception("External API call failed.");
                }
                
                patient.ChangeMedicalHistory(apiSuccess);

                await _unitOfWork.CommitAsync();
                Console.WriteLine("Transaction committed successfully");

                var patientDTO = _mapper.ToDto(patient);

                return patientDTO;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        private async Task<string> CallExternalApi(string patientMedicalRecordNumber, string[] allergies, string[] medicalConditions)
        {
            MedicalHistoryDTO medicalHistory = new MedicalHistoryDTO(patientMedicalRecordNumber, allergies, medicalConditions);
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.PostAsJsonAsync("http://localhost:4000/api/patientsMedicalHistory/create", medicalHistory);
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var responseObject = JsonConvert.DeserializeObject<dynamic>(responseContent);
                    return responseObject.id;
                }
                else
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"API call failed with status code: {response.StatusCode}");
                    Console.WriteLine($"Response content: {responseContent}");
                    Console.WriteLine($"Request content: {JsonConvert.SerializeObject(medicalHistory)}");
                    return null;
                }
            }
        }

        public async Task<PatientDTO> DeletePatient(string medicalRecordNumber)
        {
            var patient = await _repo.GetByMedicalRecordNumberAsync(medicalRecordNumber);

            if (patient == null)
                return null;

            _repo.Remove(patient);

            var log = new Log(
                TypeOfAction.Delete, patient.Id.ToString(),
                "Patient deleted.");

            await _logRepository.AddAsync(log);

            await _unitOfWork.CommitAsync();

            return _mapper.ToDto(patient);
        }

        public async Task<PatientDTO> UpdatePatient(string medicalRecordNumber, UpdatePatientDTO dto)
        {
            var patient = await _repo.GetByMedicalRecordNumberAsync(medicalRecordNumber);

            if (patient == null)
                return null;

            var updatedFields = new List<string>();

            var updateActions = new Dictionary<string, Action>
            {
                { "First Name", () => { if (!string.IsNullOrEmpty(dto.FirstName) && patient.FirstName != dto.FirstName) { patient.ChangeFirstName(dto.FirstName); updatedFields.Add("First Name"); } } },
                { "Last Name", () => { if (!string.IsNullOrEmpty(dto.LastName) && patient.LastName != dto.LastName) { patient.ChangeLastName(dto.LastName); updatedFields.Add("Last Name"); } } },
                { "Full Name", () => { if (!string.IsNullOrEmpty(dto.FullName) && patient.FullName != dto.FullName) { patient.ChangeFullName(dto.FullName); updatedFields.Add("Full Name"); } } },
                { "Email", () => { if (!string.IsNullOrEmpty(dto.Email) && patient.Email != dto.Email) { patient.ChangeEmail(dto.Email); updatedFields.Add("Email"); } } },
                { "Phone Number", () => { if (!string.IsNullOrEmpty(dto.PhoneNumber) && patient.PhoneNumber != dto.PhoneNumber) { patient.ChangePhoneNumber(dto.PhoneNumber); updatedFields.Add("Phone Number"); } } },
                { "Emergency Contact", () => { if (!string.IsNullOrEmpty(dto.EmergencyContact) && patient.EmergencyContact != dto.EmergencyContact) { patient.ChangeEmergencyContact(dto.EmergencyContact); updatedFields.Add("Emergency Contact"); } } },
            };

            foreach (var action in updateActions.Values)
            {
                action();
            }

            if (updatedFields.Count > 0)
            {
                string message = "Patient updated. The following fields were updated: " + string.Join(", ", updatedFields) + ".";
                var log = new Log(TypeOfAction.Update, patient.Id.ToString(), message);
                await _logRepository.AddAsync(log);
                await _unitOfWork.CommitAsync();
            }

            return _mapper.ToDto(patient);
        }

        public async Task<List<PatientDTO>> SearchPatients(SearchPatientDTO dto)
        {
            var patients = await _repo.SearchPatientsAsync(dto);
            if (patients == null || patients.Count == 0)
            {
                return null;
            }

            var list = patients.ConvertAll(_mapper.ToDto);
            return list;
        }

        public async Task<Patient> UpdatePatientProfile(UpdatePatientDTO dto)
        {
            ValidateUpdatePatientDTO(dto);
            var patientToUpdate = await _repo.GetByEmailAsync(dto.Email);
            if (patientToUpdate == null) throw new InvalidOperationException($"User with email {dto.Email} not found.");

            await CheckForDuplicateEmail(dto.Email);
            await CheckForDuplicatePhoneNumber(dto.PhoneNumber);

            var originalValues = new Dictionary<string, string>
            {
                { "FirstName", patientToUpdate.FirstName },
                { "LastName", patientToUpdate.LastName },
                { "Email", patientToUpdate.Email },
                { "PhoneNumber", patientToUpdate.PhoneNumber },
                { "EmergencyContact", patientToUpdate.EmergencyContact },
            };

            UpdatePatientFields(patientToUpdate, dto);
            await _repo.UpdateAsync(patientToUpdate);
            await _unitOfWork.CommitAsync();

            var updatedFields = new List<string>();
            foreach (var key in originalValues.Keys)
            {
                var originalValue = originalValues[key];
                var newValue = patientToUpdate.GetType().GetProperty(key).GetValue(patientToUpdate)?.ToString();
                if (originalValue != newValue) updatedFields.Add($"{key}: {originalValue} -> {newValue}");
            }

            if (updatedFields.Count > 0)
            {
                var logMessage = $"Patient updated. The following fields were changed: {string.Join(", ", updatedFields)}.";
                var log = new Log(TypeOfAction.Update, patientToUpdate.Id.ToString(), logMessage);
                await _logRepository.AddAsync(log);
                await _unitOfWork.CommitAsync();
            }

            return patientToUpdate;
        }

        private void ValidateUpdatePatientDTO(UpdatePatientDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || !IsValidEmail(dto.Email))
                throw new BusinessRuleValidationException("Invalid email format.");
        }

        private async Task<bool> CheckForDuplicateEmail(string email)
        {
            var existingPatient = await _repo.GetByEmailAsync(email);
            return existingPatient != null;
        }

        private async Task<bool> CheckForDuplicatePhoneNumber(string phoneNumber)
        {
            var existingPatient = await _repo.GetByPhoneNumberAsync(phoneNumber);
            return existingPatient != null;
        }

        private void UpdatePatientFields(Patient patient, UpdatePatientDTO dto)
        {
            patient.ChangeEmail(dto.Email);
            patient.ChangePhoneNumber(dto.PhoneNumber);
        }

        private bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        }
    }
}
