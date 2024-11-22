namespace DDDSample1.Domain.Patients
{
    public class LoginDTO
    {
        public string Email { get; init; }
        public string Password { get; init; }

        public LoginDTO() { }

        public LoginDTO(string email, string password)
        {
            Email = email;
            Password = password;
        }
    }
} 