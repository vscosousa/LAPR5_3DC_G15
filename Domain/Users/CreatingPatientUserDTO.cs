namespace DDDSample1.Domain.Users
{
    public class CreatingPatientUserDTO
    {
        public string Email { get; init; }
        public string Password { get; init; }
        public string PhoneNumber { get; init; }
        public string Name { get; init; }
    



        public CreatingPatientUserDTO( string email, string password, string phoneNumber, string name)
        {
            Email = email;
            Password = password;
            PhoneNumber = phoneNumber;
            Name = name;
        }
    }
}
