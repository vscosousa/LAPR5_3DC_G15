using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.User
{
    public class User : Entity<UserID>, IAggregateRoot
    {
        private string _email;
        private string _username;

        private Role _role;
        private string _passwordHash;
        private bool _isActive;

        private User() { }

        // Constructor for User to register by the admin
        public User(string email, string username, Role role)
        {
            Id = new UserID(Guid.NewGuid());
            _email = email;
            _username = username;
            _passwordHash = "";
            _role = role;
            _isActive = false;

        }

        public void SetPassword(string password)
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


        public string Email => _email;
        public string Username => _username;
        public string PasswordHash => _passwordHash;

        public Role Role => _role;
        public bool IsActive => _isActive;

    }
}
