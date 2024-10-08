using System;

namespace DDDSample1.Domain.User
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
        public DateTime? ActivationLinkSentAt { get; set; }

        // Parameterless constructor for serialization/deserialization
        public UserDTO() { }

        // Constructor to create the DTO from the User domain model
        public UserDTO(User user)
        {
            this.Id = user.Id.AsGuid();
            this.Email = user.Email.EmailValue;
            this.Username = user.Username.UsernameValue;
            this.Role = user.Role.ToString();
            this.IsActive = user.IsActive;
            this.ActivationLinkSentAt = user.ActivationLinkSentAt;
        }
    }
}
