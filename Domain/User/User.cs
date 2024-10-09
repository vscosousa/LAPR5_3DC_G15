using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.User
{
    public class User : Entity<UserID>, IAggregateRoot
    {
        private string _email;
        private string _username;
        private Role _role; 

        private string _password;
        private bool _isActive;
        private DateTime? _activationLinkSentAt;

        private User() { }

        // Constructor for User to register by the admin
        public User(string email, string username, Role role)
        {
            Id = new UserID(Guid.NewGuid());
            _email = email;
            _username = username;
            _role = role;
            _password = null;
            _isActive = false;
            _activationLinkSentAt = DateTime.Now;
        }

        // Constructor for User to register himself, Password is created by the user
        public User(string email, string username)
        {
            Id = new UserID(Guid.NewGuid());
            _email = email;
            _username = username;
            _role = Role.Patient;  
            _password = null;
            _isActive = false;
            _activationLinkSentAt = DateTime.Now;
        }

        public void SetPassword(string password)
        {
            _password = password;
            _isActive = true;
            _activationLinkSentAt = null;
        }

        
        public string Email => _email;
        public string Username => _username;
        public Role Role => _role;  
        public string Password => _password;
        public bool IsActive => _isActive;
        public DateTime? ActivationLinkSentAt => _activationLinkSentAt;
    }
}
