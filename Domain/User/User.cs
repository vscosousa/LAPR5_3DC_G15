using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.ValueObjects;

namespace DDDSample1.Domain.User
{
    public class User : Entity<UserID>, IAggregateRoot
    {
        public Email Email { get; private set; }
        public Username Username { get; private set; }
        public Role Role { get; private set; } // Admin, Doctor, Nurse, Technician, Patient
        public bool IsActive { get; private set; }
        public DateTime? ActivationLinkSentAt { get; private set; } // Timestamp for when activation link was sent

        private User() { }
        // Constructor for Admin to register backoffice users (doctor, nurse, etc.)
        public User(Email email, Username username, Role role)
        {
            this.Id = new UserID(Guid.NewGuid());
            this.Email = email;
            this.Username = username;
            this.Role = role;
            this.IsActive = false; // User is inactive until they set up their password
        }

        // Constructor for self-registration by patients
        public User(Email email, Username username, string role)
        {
            this.Id = new UserID(Guid.NewGuid());
            this.Email = email;
            this.Username = username;
            this.Role = Role.FromString("Patient");
            this.IsActive = false; // Inactive until password is set
        }
    }
}

