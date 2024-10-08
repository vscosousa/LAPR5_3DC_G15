using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using System;
using DDDSample1.Domain.ValueObjects;
using System.Linq;
using Newtonsoft.Json;

namespace DDDSample1.Domain.Patients
{
    public class PatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _repo;

        public PatientService(IUnitOfWork unitOfWork, IPatientRepository repo) // IUserRepository -> IPatientRepository
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
        }

        public async Task<Patient> CreatePatient(CreatingPatientDTO dto)
        {
            try
            {
                // Convert DTO properties to value objects
                var firstName = new Name(dto.FirstName);
                var lastName = new Name(dto.LastName);
                var fullName = new FullName(dto.FullName);
                var dateOfBirth = DateOnly.FromDateTime(DateTime.Parse(dto.DateOfBirth));
                var genderOption = (GenderOptions)Enum.Parse(typeof(GenderOptions), dto.Gender, true);
                var gender = new Gender(genderOption);
                var medicalRecordNumber = new MedicalRecordNumber(dto.MedicalRecordNumber);
                var email = new Email(dto.Email);
                var phoneNumber = new PhoneNumber(dto.PhoneNumber);
                var emergencyContactPhoneNumber = new PhoneNumber(dto.EmergencyContact);
                var emergencyContact = new EmergencyContact(emergencyContactPhoneNumber);
                var medicalConditions = new MedicalConditions(dto.MedicalConditions);
                var appointmentDates = dto.AppointmentHistory.Select(date => DateTime.Parse(date)).ToArray();
                var appointmentHistory = new AppointmentHistory(appointmentDates);

                var patient = new Patient(firstName, lastName, fullName, dateOfBirth, gender, medicalRecordNumber, email, phoneNumber, emergencyContact, medicalConditions, appointmentHistory);

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

        public async Task<Patient> DeletePatient(PatientId id)
        {
            Patient patient = await _repo.GetByIdAsync(id);

            if (patient == null)
                return null;

            _repo.Remove(patient);
            await _unitOfWork.CommitAsync();

            return patient;
        }
    }
}
