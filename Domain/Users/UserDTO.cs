using System;

namespace DDDSample1.Domain.Users
{
    public class UserDTO
    {
        public Guid Id { get; init; }
        public string Email { get; init; }
        public string Username { get; init; }  
        public bool IsActive { get; init; }

        public UserDTO() { }
        public UserDTO(Guid id, string email, string username, bool isActive)
        {
            Id = id;
            Email = email;
            Username = username;
            IsActive = isActive;
        }
    }
}
