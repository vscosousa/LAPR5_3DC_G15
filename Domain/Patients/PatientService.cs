using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using DDDSample1.Domain.Logs;
using System.Linq;
using DDDSample1.Infrastructure.Patients;
using Microsoft.EntityFrameworkCore;

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

        public async Task<Patient> CreatePatient(CreatingPatientDTO dto)
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
                await _unitOfWork.CommitAsync();
                Console.WriteLine("Transaction committed successfully");

                return patient;
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

        public async Task<PatientDTO> DeletePatient(PatientId id)
        {
            var patient = await _repo.GetByIdAsync(id);

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

        public async Task<PatientDTO> UpdatePatient(Guid id, UpdatePatientDTO dto)
        {
            var patient = await _repo.GetByIdAsync(new PatientId(id));

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
                { "Medical Conditions", () => { if (!string.IsNullOrEmpty(dto.MedicalConditions) && patient.MedicalConditions != dto.MedicalConditions) { patient.ChangeMedicalConditions(dto.MedicalConditions); updatedFields.Add("Medical Conditions"); } } }
            };

            foreach (var action in updateActions.Values)
            {
                action();
            }

            if (updatedFields.Count > 0)
            {
                string message = "Patient updated. The following fields were updated: " + string.Join(", ", updatedFields) + ".";
                var log = new Log(TypeOfAction.Update,patient.Id.ToString(), message);
                await _logRepository.AddAsync(log);
                await _unitOfWork.CommitAsync();
            }

            return _mapper.ToDto(patient);
        }

        public async Task<List<PatientDTO>> SearchPatients(SearchPatientDTO dto)
        {
            var patients = await _repo.SearchPatientsAsync(dto);
            var list = patients.ConvertAll(_mapper.ToDto);
            if (list.Count == 0)
                return null;
            return list;
        }
    }
}
