using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class Patient : Entity<PatientId>, IAggregateRoot
    {
        private string _firstName;
        private string _lastName;
        private string _fullName;
        private DateOnly _dateOfBirth;
        private GenderOptions _genderOptions;
        private int _medicalRecordNumber;
        private string _email;
        private string _phoneNumber;
        private string _emergencyContact;
        private string _medicalConditions;
        private DateTime[] _appointmentHistory;
        private bool _isActive;

        // Parameterless constructor for EF Core
        private Patient() { }

        public Patient(string firstName, string lastName, string fullName, DateOnly dateOfBirth, GenderOptions gender, int medicalRecordNumber, string email, string phoneNumber, string emergencyContact, string medicalConditions, DateTime[] appointmentHistory)
        {
            Id = new PatientId(Guid.NewGuid());
            _firstName = firstName;
            _lastName = lastName;
            _fullName = fullName;
            _dateOfBirth = dateOfBirth;
            _genderOptions = gender;
            _medicalRecordNumber = medicalRecordNumber;
            _email = email;
            _phoneNumber = phoneNumber;
            _emergencyContact = emergencyContact;
            _medicalConditions = medicalConditions;
            _appointmentHistory = appointmentHistory;
            _isActive = true;
        }

        public string FirstName => _firstName;
        public string LastName => _lastName;
        public string FullName => _fullName;
        public DateOnly DateOfBirth => _dateOfBirth;
        public GenderOptions GenderOptions => _genderOptions;
        public int MedicalRecordNumber => _medicalRecordNumber;
        public string Email => _email;
        public string PhoneNumber => _phoneNumber;
        public string EmergencyContact => _emergencyContact;
        public string MedicalConditions => _medicalConditions;
        public DateTime[] AppointmentHistory => _appointmentHistory;
        public bool IsActive => _isActive;

        public void ChangeFirstName(string firstName)
        {
            _firstName = firstName;
        }

    }
}