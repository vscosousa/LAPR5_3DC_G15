using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class User : Entity<UserID>, IAggregateRoot
    {
        private PatientId _patientId;
        private StaffId _staffId;
        private string _email;
        private string _username;
        private string _phoneNumber;
        private Role _role;
        private string _passwordHash;
        private bool _isActive;

        [JsonIgnore]
        private Patient _patient;
        private Staff _staff;

        private User() { }
        // Constructor for User to register by the admin
        public User(string email, string username, Role role)
        {
            Id = new UserID(Guid.NewGuid());
            _patientId = null;
            _patient = null;
            _staffId = null;
            _staff = null;
            _email = email;
            _phoneNumber = "";
            _username = username;
            _passwordHash = "";
            _role = role;
            _isActive = false;

        }

        // Constructor for User to register by the patient/staff
        public User(string email, string phoneNumber, Role role, string password, Guid IdRole)
        {
            Id = new UserID(Guid.NewGuid());
            _email = email;
            _phoneNumber = phoneNumber;
            _username = email;
            _role = role;
            SetPassword(password);
            _isActive = false;
            if (_role == Role.Patient)
            {
                _patientId = new PatientId(IdRole);
                _staffId = null;
                _staff = null;

            }
            else if (_role == Role.Doctor || _role == Role.Nurse || _role == Role.Technician)
            {
                _staffId = new StaffId(IdRole);
                _patientId = null;
                _patient = null;
            }
        }


        public string Email => _email;
        public string Username => _username;
        public string PhoneNumber => _phoneNumber;
        public string PasswordHash => _passwordHash;
        public Role Role => _role;
        public bool IsActive => _isActive;
        public PatientId PatientId => _patientId;
        public Patient Patient => _patient;
        public StaffId StaffId => _staffId;
        public Staff Staff => _staff;

        internal void SetPassword(string password)
        {

            var passwordRegex = new System.Text.RegularExpressions.Regex(@"^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d]).{10,}$");

            // Validate the password
            if (!passwordRegex.IsMatch(password))
            {
                throw new ArgumentException("Password must be at least 10 characters long, include at least one digit, one uppercase letter, and one special character.");
            }
            
            _passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            _isActive = true;
        }

        internal void Activate()
        {
            _isActive = true;
        }

    }
}
