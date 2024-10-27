namespace DDDSample1.Domain.Users
{
public class UpdatePatientUserDTO
    {
        public string Email { get; init; }
        public string Password { get; init; }
        public string PhoneNumber { get; init; }


        public UpdatePatientUserDTO()
        {
        }
        public UpdatePatientUserDTO(string email, string password, string phoneNumber)
        {
            Email = email;
            Password = password;
            PhoneNumber = phoneNumber;
        }
    }
}