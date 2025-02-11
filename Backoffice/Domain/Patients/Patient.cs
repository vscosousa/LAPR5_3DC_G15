using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using BCrypt.Net;

namespace DDDSample1.Domain.Patients
{
    public class Patient : Entity<PatientId>, IAggregateRoot
    {
        private string _firstName;
        private string _lastName;
        private string _fullName;
        private DateOnly _dateOfBirth;
        private GenderOptions _genderOptions;
        private string _medicalRecordNumber;
        private string _email;
        private string _phoneNumber;
        private string _emergencyContact;
        private string _medicalHistory;
        private DateTime[] _appointmentHistory;
        private bool _isActive;

        // Parameterless constructor for EF Core
        private Patient() { }

        public Patient(string firstName, string lastName, string fullName, DateOnly dateOfBirth, GenderOptions gender, string email, string phoneNumber, string emergencyContact)
        {
            if (!NameStartsWithCapital(firstName) || !NameStartsWithCapital(lastName) || !NameStartsWithCapital(fullName))
                throw new BusinessRuleValidationException("Names must start with a capital letter.");

            if (!DateTime.TryParseExact(dateOfBirth.ToString("yyyy/MM/dd"), "yyyy/MM/dd", null, System.Globalization.DateTimeStyles.None, out _))
                throw new BusinessRuleValidationException("Date of birth must be in the format YYYY/MM/DD.");

            if (dateOfBirth > DateOnly.FromDateTime(DateTime.Now))
                throw new BusinessRuleValidationException("Date of birth must be in the past.");

            if (!Enum.IsDefined(typeof(GenderOptions), gender))
                throw new BusinessRuleValidationException("Invalid gender option.");

            if (!Regex.IsMatch(email, @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"))
                throw new BusinessRuleValidationException("Email must be in a valid format.");

            if (!phoneNumber.StartsWith("+") || !phoneNumber.Substring(1).All(char.IsDigit))
                throw new BusinessRuleValidationException("Phone number must start with an identifier and contain only digits.");

            if (!emergencyContact.StartsWith("+") || !emergencyContact.Substring(1).All(char.IsDigit))
                throw new BusinessRuleValidationException("Emergency phone number must start with an identifier and contain only digits.");

            Id = new PatientId(Guid.NewGuid());
            _firstName = firstName;
            _lastName = lastName;
            _fullName = fullName;
            _dateOfBirth = dateOfBirth;
            _genderOptions = gender;
            _medicalRecordNumber = "";
            _email = email;
            _phoneNumber = phoneNumber;
            _emergencyContact = emergencyContact;
            _medicalHistory = "";
            _appointmentHistory = Array.Empty<DateTime>();
            _isActive = true;
        }

        public string FirstName => _firstName;
        public string LastName => _lastName;
        public string FullName => _fullName;
        public DateOnly DateOfBirth => _dateOfBirth;
        public GenderOptions GenderOptions => _genderOptions;
        public string MedicalRecordNumber => _medicalRecordNumber;
        public string Email => _email;
        public string PhoneNumber => _phoneNumber;
        public string EmergencyContact => _emergencyContact;
        public string MedicalHistory => _medicalHistory;
        public DateTime[] AppointmentHistory => _appointmentHistory;
        public bool IsActive => _isActive;
        internal void ChangeFirstName(string firstName) => _firstName = firstName;
        internal void ChangeLastName(string lastName) => _lastName = lastName;
        internal void ChangeFullName(string fullName) => _fullName = fullName;
        internal void ChangeMedicalHistory(string medicalHistory) => _medicalHistory = medicalHistory;
        internal void ChangeEmail(string email)
        {
            if (!Regex.IsMatch(email, @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"))
                throw new ArgumentException("Email must be in a valid format.");
            _email = email;
        }
        internal void ChangePhoneNumber(string phoneNumber)
        {
            if (!phoneNumber.StartsWith("+") || !phoneNumber.Substring(1).All(char.IsDigit))
                throw new BusinessRuleValidationException("Phone number must start with an identifier and contain only digits.");
            _phoneNumber = phoneNumber;
        }
        internal void ChangeEmergencyContact(string emergencyContact)
        {
            if (!emergencyContact.StartsWith("+") || !emergencyContact.Substring(1).All(char.IsDigit))
                throw new BusinessRuleValidationException("Emergency phone number must start with an identifier and contain only digits.");
            _emergencyContact = emergencyContact;
        }
        internal void AssignMedicalRecordNumber(string medicalRecordNumber) => _medicalRecordNumber = medicalRecordNumber;
        private bool NameStartsWithCapital(string fullName)
        {
            if (!char.IsUpper(fullName[0]))
                return false;

            string[] names = fullName.Split(' ');
            foreach (string name in names)
            {
                if (!char.IsUpper(name[0]))
                    return false;
            }
            return true;
        }

        internal void AddOperationRequest(DateTime operationRequestDate)
        {
            _appointmentHistory.Append(operationRequestDate);
        }

        internal void RemoveOperationRequest(DateTime operationRequestDate)
        {
            _appointmentHistory = _appointmentHistory.Where(date => date != operationRequestDate).ToArray();
        }
    }
}