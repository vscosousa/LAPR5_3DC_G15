namespace DDDSample1.Domain.Users
{
    public class CreatingUserDTO
    {
        public string Email { get; set; }
        public string Username { get; set; }

        public Role Role { get; set; }

        public CreatingUserDTO() { }

        public CreatingUserDTO( string email, string username, Role role)
        {
            Email = email;
            Username = username;
            Role = role;
        }
    }
}
