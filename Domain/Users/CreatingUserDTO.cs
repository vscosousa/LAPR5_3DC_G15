using System;

namespace DDDSample1.Domain.Users
{
    public class CreatingUserDTO
    {
        public string Email { get; init; }
        public string Username { get; init; }
        public Role Role { get; init; }
        public Guid StaffId { get; init; }

        public CreatingUserDTO() { }

        public CreatingUserDTO( string email, string username, Role role, Guid staffId)
        {
            Email = email;
            Username = username;
            Role = role;
            StaffId = staffId;
        }
    }
}
