using System;

namespace DDDSample1.Domain.Users
{
    public class CreatingPatientUserDTO
    {
        public string Email { get; init; }
        public string Password { get; init; }
        public string PhoneNumber { get; init; }
    
        public CreatingPatientUserDTO()
        {
        }
        public CreatingPatientUserDTO(string email, string password, string phoneNumber)
        {
            Email = email;
            Password = password;
            PhoneNumber = phoneNumber;
        }
    }
}
