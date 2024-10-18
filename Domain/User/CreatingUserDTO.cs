namespace DDDSample1.Domain.User
{
    public class CreatingUserDTO
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public CreatingUserDTO( string email, string username, string password)
        {
            this.Email = email;
            this.Username = username;
            this.Password = password;
        }
    }
}
