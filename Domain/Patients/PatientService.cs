using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using System;
using System.Linq;

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
                var firstName = dto.FirstName;
                var lastName = dto.LastName;
                var fullName = dto.FullName;
                var dateOfBirth = DateOnly.FromDateTime(DateTime.Parse(dto.DateOfBirth));
                var genderOption = (GenderOptions)Enum.Parse(typeof(GenderOptions), dto.Gender, true);
                var medicalRecordNumber = dto.MedicalRecordNumber;
                var email = dto.Email;
                var phoneNumber = dto.PhoneNumber;
                var emergencyContact = dto.EmergencyContact;
                var medicalConditions = dto.MedicalConditions;
                var appointmentHistory = dto.AppointmentHistory.Select(date => DateTime.Parse(date)).ToArray();

                var patient = new Patient(firstName, lastName, fullName, dateOfBirth, genderOption, medicalRecordNumber, email, phoneNumber, emergencyContact, medicalConditions, appointmentHistory);

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
            await _unitOfWork.CommitAsync();

            return new PatientDTO { Id = patient.Id.AsGuid(), FirstName = patient.FirstName.ToString(), LastName = patient.LastName.ToString(), FullName = patient.FullName.ToString(), DateOfBirth = patient.DateOfBirth.ToString(), Gender = patient.GenderOptions.ToString(), MedicalRecordNumber = patient.MedicalRecordNumber.ToString(), Email = patient.Email.ToString(), PhoneNumber = patient.PhoneNumber.ToString(), EmergencyContact = patient.EmergencyContact.ToString(), MedicalConditions = patient.MedicalConditions.ToString(), AppointmentHistory = patient.AppointmentHistory.ToString(), IsActive = patient.IsActive };
        }
    }
}
