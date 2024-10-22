namespace DDDSample1.Domain.Users
{
    public class CreatingStaffUserDTO
    {
        public string Email { get; init; }
        public string Role { get; init; }
        public string Password { get; init; }
        public string PhoneNumber { get; init; }
        public string Name { get; init; }

        public CreatingStaffUserDTO( string email, string role, string password, string phoneNumber, string name)
        {
            Email = email;
            Role = role;
            Password = password;
            PhoneNumber = phoneNumber;
            Name = name;
        }
    }
}