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
        public ContactInformation ContactInformation { get; set; }
        public EmergencyContact EmergencyContact { get; set; }
        public MedicalConditions MedicalConditions { get; set; }
        public AppointmentHistory AppointmentHistory { get; set; }
        public bool IsActive { get; set; }
        public DateTime? ActivationLinkSentAt { get; set; }

        public PatientDTO() { }

        public PatientDTO(Guid id, Name firstName, Name lastName, FullName fullName, Date dateofBirth, Gender gender, MedicalRecordNumber medicalRecordNumber, ContactInformation contactInformation, EmergencyContact emergencyContact, MedicalConditions medicalConditions, AppointmentHistory appointmentHistory, bool isActive, DateTime? activationLinkSentAt)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            DateOfBirth = dateofBirth;
            Gender = gender;
            MedicalRecordNumber = medicalRecordNumber;
            ContactInformation = contactInformation;
            EmergencyContact = emergencyContact;
            MedicalConditions = medicalConditions;
            AppointmentHistory = appointmentHistory;
            IsActive = isActive;
            ActivationLinkSentAt = activationLinkSentAt;
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
                patient.ContactInformation,
                patient.EmergencyContact,
                patient.MedicalConditions,
                patient.AppointmentHistory,
                patient.IsActive,
                patient.ActivationLinkSentAt
            );
        }
    }
}