using System;

namespace DDDSample1.Domain.User
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }  
        public bool IsActive { get; set; }
        public DateTime? ActivationLinkSentAt { get; set; }

       
        public UserDTO(Guid id, string email, string username, string password, bool isActive, DateTime? activationLinkSentAt)
        {
            Id = id;
            Email = email;
            Username = username;
            Password = password;
            IsActive = isActive;
            ActivationLinkSentAt = activationLinkSentAt;
        }

    

    
    }
}
