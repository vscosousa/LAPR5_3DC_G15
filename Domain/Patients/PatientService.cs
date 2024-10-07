using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using System;
using DDDSample1.Domain.ValueObjects;

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

        // Get all users
        public async Task<List<PatientDTO>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            //List<PatientDTO> listDto = list.ConvertAll(user => PatientDTO.FromDomain(user));

            return null;
        }

        /* Get user by ID
        public async Task<UserDTO> GetByIdAsync(UserID id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;

            return UserDTO.FromDomain(user);
        }*/

                public async Task<Patient> CreatePatient(CreatingPatientDTO dto)
        {
            try
            {
                // Convert DTO properties to value objects
                var firstName = new Name(dto.FirstName);
                var lastName = new Name(dto.LastName);
                var fullName = new FullName(dto.FullName);
                var genderOption = (GenderOptions)Enum.Parse(typeof(GenderOptions), dto.Gender, true);
                var gender = new Gender(genderOption);
                var dateOfBirth = new Date(dto.DateOfBirth);
                var medicalRecordNumber = new MedicalRecordNumber(dto.MedicalRecordNumber);
                var email = new Email(dto.Email);
                var phoneNumber = new PhoneNumber(dto.PhoneNumber);
                var emergencyContactPhoneNumber = new PhoneNumber(dto.EmergencyContact);
                var emergencyContact = new EmergencyContact(emergencyContactPhoneNumber);
                var medicalConditions = new MedicalConditions(dto.MedicalConditions);
                var appointmentDates = Array.ConvertAll(dto.AppointmentHistory, date => DateTime.Parse(date));
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

        /* Delete a user
        public async Task<UserDTO> DeleteAsync(UserID id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;

            this._repo.Remove(user);
            await this._unitOfWork.CommitAsync();

            return UserDTO.FromDomain(user);
        }*/


    }
}
