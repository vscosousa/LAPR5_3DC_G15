namespace DDDSample1.Domain.Users
{
    public class CreatingUserDTO
    {
        public string Email { get; set; }
        public string Username { get; set; }

        public string Role { get; set; }

        public CreatingUserDTO( string email, string username, string role)
        {
            Email = email;
            Username = username;
            Role = role;
        }
    }
}
