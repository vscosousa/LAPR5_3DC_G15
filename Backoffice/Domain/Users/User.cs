using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class User : Entity<UserID>, IAggregateRoot
    {
        private string _email;
        private string _username;
        private string _phoneNumber;
        private Role _role;
        private string _passwordHash;
        private bool _isActive;
        private int _failedLoginAttempts; // Tracks the number of failed login attempts
        private DateTime? _lockedUntil;   // Tracks the time until the account is locked
        private bool _isLocked;           // Indicates if the account is currently locked

        [JsonIgnore]
        private Patient _patient;
        private PatientId _patientId;

        [JsonIgnore]
        private Staff _staff;
        private StaffId _staffId;

        private User() { }

        

        [JsonConstructor]
        // Constructor for User registered by the admin
        public User(string email, string username, Role role, Guid staffId)
        {
            Id = new UserID(Guid.NewGuid());
            _email = email;
            _phoneNumber = "";
            _username = username;
            _passwordHash = "";
            _role = role;
            _isActive = false;
            _isLocked = false;
            _failedLoginAttempts = 0;
            _patientId = null;
            _staffId = new StaffId(staffId);
        }

        // Constructor for User registered by the patient
        public User(string email, string password, string phoneNumber, Guid patientId)
        {
            Id = new UserID(Guid.NewGuid());
            _email = email;
            _phoneNumber = phoneNumber;
            _username = email;
            _role = Role.Patient;
            _passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            _isActive = false;
            _isLocked = false;
            _failedLoginAttempts = 0;
            _patientId = new PatientId(patientId);
            _staffId = null;
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
        public int FailedLoginAttempts => _failedLoginAttempts;
        public DateTime? LockedUntil => _lockedUntil;
        public bool IsLocked => _isLocked;

        internal string SetPassword(string password)
        {
            var passwordRegex = new System.Text.RegularExpressions.Regex(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).{10,}$");

            // Validate the password
            if (!passwordRegex.IsMatch(password))
            {
                throw new ArgumentException("Password must be at least 10 characters long, include at least one digit, one uppercase letter, and one special character.");
            }

            _passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            _isActive = true;

            return _passwordHash;
        }

        internal void Activate()
        {
            _isActive = true;
        }

        // Method to handle login failures and account lockout
        internal void RegisterFailedLoginAttempt()
        {
            _failedLoginAttempts++;

            if (_failedLoginAttempts >= 5)
            {
                LockAccount();
            }
        }

        // lock the account for a set period
        internal void LockAccount()
        {
            _isLocked = true;
            _lockedUntil = DateTime.UtcNow.AddMinutes(30);
        }

        // check if the account is currently locked
        public bool IsAccountLocked()
        {
            if (_isLocked && _lockedUntil.HasValue && _lockedUntil.Value > DateTime.UtcNow)
            {
                return true;
            }

            // Unlock the account if the lockout period has expired
            if (_isLocked && _lockedUntil.HasValue && _lockedUntil.Value <= DateTime.UtcNow)
            {
                _isLocked = false;
                _failedLoginAttempts = 0;
            }

            return false;
        }

        // failed login attempts after a successful login
        internal void ResetFailedLoginAttempts()
        {
            _failedLoginAttempts = 0;
        }

        internal void UnlockAccount()
        {
            _isLocked = false;
            _lockedUntil = null;
        }

        internal void ChangeEmail(string email)
        {
            if (!System.Text.RegularExpressions.Regex.IsMatch(email, @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"))
                throw new ArgumentException("Email must be in a valid format.");
            _email = email;
        }

        internal void ChangePhoneNumber(string phoneNumber)
        {
            if (!System.Text.RegularExpressions.Regex.IsMatch(phoneNumber, @"^(\+[0-9]{1,3})?[0-9]{9,10}$"))
                throw new ArgumentException("Phone number must be in a valid format.");
            _phoneNumber = phoneNumber;
        }
    }
}
