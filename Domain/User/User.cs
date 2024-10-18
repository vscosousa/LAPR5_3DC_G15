using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.User
{
    public class User : Entity<UserID>, IAggregateRoot
    {
        private string _email;
        private string _username;
        private string _passwordHash;
        private bool _isActive;
        private DateTime? _activationLinkSentAt;

        private User() { }

        // Constructor for User to register by the admin
        public User(string email, string username, string passwordHash){
            Id = new UserID(Guid.NewGuid());
            _email = email;
            _username = username;
            _passwordHash = passwordHash;
            _isActive = true;
            _activationLinkSentAt = null;
        }

        public void SetPassword(string password)
        {
            _passwordHash = password;
            _isActive = true;
            _activationLinkSentAt = null;
        }
        
        public string Email => _email;
        public string Username => _username;
        public string PasswordHash => _passwordHash;
        public bool IsActive => _isActive;
        public DateTime? ActivationLinkSentAt => _activationLinkSentAt;
    }
}
