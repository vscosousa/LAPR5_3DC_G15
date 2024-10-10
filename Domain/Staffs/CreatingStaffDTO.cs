namespace DDDSample1.Domain.Staffs
{
    public class CreatingStaffDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Specialization { get; set; }
        public string LicenseNumber { get; set; }

        public CreatingStaffDTO() { }

        public CreatingStaffDTO(string firstName, string lastName, string fullName, string email, string phoneNumber, string specialization, string licenseNumber)
        {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            Specialization = specialization;
            LicenseNumber = licenseNumber;
        }
    }
}
