using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class User : Entity<UserID>, IAggregateRoot
    {
        private StaffId _staffId;
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

        private User() { }

        // Constructor for User registered by the admin
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
            _isLocked = false;
            _failedLoginAttempts = 0;
        }

        // Constructor for User registered by the patient/staff
        public User(string email, string phoneNumber, string password, Guid patientId)
        {
            Id = new UserID(Guid.NewGuid());
            _email = email;
            _phoneNumber = phoneNumber;
            _username = email;
            _role = Role.Patient; 
            SetPassword(password);
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
        public int FailedLoginAttempts => _failedLoginAttempts;
        public DateTime? LockedUntil => _lockedUntil;
        public bool IsLocked => _isLocked;
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
    }
}
