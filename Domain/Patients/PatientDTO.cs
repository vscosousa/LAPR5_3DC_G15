using System;
using DDDSample1.Domain.ValueObjects;

namespace DDDSample1.Domain.Patients
{
    public class PatientDTO
    {
        public Guid Id { get; set; }
        public Name FirstName { get; set; }
        public Name LastName { get; set; }
        public FullName FullName { get; set; }
        public Date DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public MedicalRecordNumber MedicalRecordNumber { get; set; }
        public Email Email { get; set; }
        public PhoneNumber PhoneNumber { get; set; }
        public EmergencyContact EmergencyContact { get; set; }
        public MedicalConditions MedicalConditions { get; set; }
        public AppointmentHistory AppointmentHistory { get; set; }
        public bool IsActive { get; set; }

        public PatientDTO() { }

        public PatientDTO(Guid id, Name firstName, Name lastName, FullName fullName, Date dateofBirth, Gender gender, MedicalRecordNumber medicalRecordNumber, Email email, PhoneNumber phoneNumber, EmergencyContact emergencyContact, MedicalConditions medicalConditions, AppointmentHistory appointmentHistory, bool isActive)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            DateOfBirth = dateofBirth;
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
                patient.FirstName,
                patient.LastName,
                patient.FullName,
                patient.DateOfBirth,
                patient.Gender,
                patient.MedicalRecordNumber,
                patient.Email,
                patient.PhoneNumber,
                patient.EmergencyContact,
                patient.MedicalConditions,
                patient.AppointmentHistory,
                patient.IsActive
            );
        }
    }
}