using System;
using DDDSample1.Domain.ValueObjects;

namespace DDDSample1.Domain.Patients
{
    public class PatientDTO
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string MedicalRecordNumber { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string EmergencyContact { get; set; }
        public string MedicalConditions { get; set; }
        public string AppointmentHistory { get; set; }
        public bool IsActive { get; set; }

        public PatientDTO() { }

        public PatientDTO(Guid id, string firstName, string lastName, string fullName, string dateOfBirth, string gender, string medicalRecordNumber, string email, string phoneNumber, string emergencyContact, string medicalConditions, string appointmentHistory, bool isActive)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            DateOfBirth = dateOfBirth;
            Gender = gender;
            MedicalRecordNumber = medicalRecordNumber;
            Email = email;
            PhoneNumber = phoneNumber;
            EmergencyContact = emergencyContact;
            MedicalConditions = medicalConditions;
            AppointmentHistory = appointmentHistory;
            IsActive = isActive;
        }

        // Static method to convert a domain Patient entity to a PatientDTO
        public static PatientDTO FromDomain(Patient patient)
        {
            return new PatientDTO(
                Guid.Parse(patient.Id.Value),
                patient.FirstName.NameValue,
                patient.LastName.NameValue,
                patient.FullName.FullNameValue,
                patient.DateOfBirth.ToString(),
                patient.Gender.GenderOption.ToString(),
                patient.MedicalRecordNumber.Number.ToString(),
                patient.Email.EmailValue,
                patient.PhoneNumber.Number,
                patient.EmergencyContact.EmergencyNumberValue.Number,
                string.Join(", ", patient.MedicalConditions.Conditions),
                string.Join(", ", patient.AppointmentHistory.Appointment),
                patient.IsActive
            );
        }
    }
}