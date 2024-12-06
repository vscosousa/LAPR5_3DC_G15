namespace DDDSample1.Domain.Patients
{
    public class UpdatePatientDTO
    {
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public string FullName { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public string EmergencyContact { get; init; }
        public UpdatePatientDTO() { }

        public UpdatePatientDTO(string firstName, string lastName, string fullName, string email, string phoneNumber, string emergencyContact)
        {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            EmergencyContact = emergencyContact;
        }
    }
}