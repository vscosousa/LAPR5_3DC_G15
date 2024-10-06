using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.ValueObjects;

namespace DDDSample1.Domain.Patients
{
    public class Patient : Entity<PatientId>, IAggregateRoot
    {
        private Name _firstName;
        private Name _lastName;
        private FullName _fullName;
        private Date _dateOfBirth;
        private Gender _gender;
        private MedicalRecordNumber _medicalRecordNumber;
        private ContactInformation _contactInformation;
        private MedicalConditions _medicalConditions;
        private EmergencyContact _emergencyContact;
        private AppointmentHistory _appointmentHistory;
        private bool _isActive;
        private DateTime? _activationLinkSentAt;

        // Parameterless constructor for EF Core
        private Patient() { }

        public Patient(Name firstName, Name lastName, FullName fullName, Date dateOfBirth, Gender gender, MedicalRecordNumber medicalRecordNumber, ContactInformation contactInformation, EmergencyContact emergencyContact, MedicalConditions medicalConditions, AppointmentHistory appointmentHistory)
        {
            Id = new PatientId(Guid.NewGuid());
            _firstName = firstName;
            _lastName = lastName;
            _fullName = fullName;
            _dateOfBirth = dateOfBirth;
            _gender = gender;
            _medicalRecordNumber = medicalRecordNumber;
            _contactInformation = contactInformation;
            _emergencyContact = emergencyContact;
            _medicalConditions = medicalConditions;
            _appointmentHistory = appointmentHistory;
            _isActive = true;
            _activationLinkSentAt = DateTime.UtcNow;
        }

        // Public getters
        public Name FirstName => _firstName;
        public Name LastName => _lastName;
        public FullName FullName => _fullName;
        public Date DateOfBirth => _dateOfBirth;
        public Gender Gender => _gender;
        public MedicalRecordNumber MedicalRecordNumber => _medicalRecordNumber;
        public ContactInformation ContactInformation => _contactInformation;
        public MedicalConditions MedicalConditions => _medicalConditions;
        public EmergencyContact EmergencyContact => _emergencyContact;
        public AppointmentHistory AppointmentHistory => _appointmentHistory;
        public bool IsActive => _isActive;
        public DateTime? ActivationLinkSentAt => _activationLinkSentAt;

        public static Patient FromDTO(PatientDTO dto)
        {
            return new Patient(
                dto.FirstName,
                dto.LastName,
                dto.FullName,
                dto.DateOfBirth,
                dto.Gender,
                dto.MedicalRecordNumber,
                dto.ContactInformation,
                dto.EmergencyContact,
                dto.MedicalConditions,
                dto.AppointmentHistory
            );
        }
    }
}