namespace DDDSample1.Domain.Users
{
    public class RequestPasswordResetDTO
    {
        public string Email { get; set; }

        public RequestPasswordResetDTO(string email)
        {
            Email = email;
        }
    }
}