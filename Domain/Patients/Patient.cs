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
        private Email _email;
        private PhoneNumber _phoneNumber;
        private MedicalConditions _medicalConditions;
        private EmergencyContact _emergencyContact;
        private AppointmentHistory _appointmentHistory;
        private bool _isActive;

        // Parameterless constructor for EF Core
        private Patient() { }

        public Patient(Name firstName, Name lastName, FullName fullName, Date dateOfBirth, Gender gender, MedicalRecordNumber medicalRecordNumber, Email email, PhoneNumber phoneNumber, EmergencyContact emergencyContact, MedicalConditions medicalConditions, AppointmentHistory appointmentHistory)
        {
            Id = new PatientId(Guid.NewGuid());
            _firstName = firstName;
            _lastName = lastName;
            _fullName = fullName;
            _dateOfBirth = dateOfBirth;
            _gender = gender;
            _medicalRecordNumber = medicalRecordNumber;
            _email = email;
            _phoneNumber = phoneNumber;
            _emergencyContact = emergencyContact;
            _medicalConditions = medicalConditions;
            _appointmentHistory = appointmentHistory;
            _isActive = true;
        }

        // Public getters
        public Name FirstName => _firstName;
        public Name LastName => _lastName;
        public FullName FullName => _fullName;
        public Date DateOfBirth => _dateOfBirth;
        public Gender Gender => _gender;
        public MedicalRecordNumber MedicalRecordNumber => _medicalRecordNumber;
        public Email Email => _email;
        public PhoneNumber PhoneNumber => _phoneNumber;
        public MedicalConditions MedicalConditions => _medicalConditions;
        public EmergencyContact EmergencyContact => _emergencyContact;
        public AppointmentHistory AppointmentHistory => _appointmentHistory;
        public bool IsActive => _isActive;
        public static Patient FromDTO(PatientDTO dto)
        {
            return new Patient(
                dto.FirstName,
                dto.LastName,
                dto.FullName,
                dto.DateOfBirth,
                dto.Gender,
                dto.MedicalRecordNumber,
                dto.Email,
                dto.PhoneNumber,
                dto.EmergencyContact,
                dto.MedicalConditions,
                dto.AppointmentHistory
            );
        }
    }
}