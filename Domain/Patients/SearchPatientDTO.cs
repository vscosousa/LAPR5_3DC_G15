namespace DDDSample1.Domain.Patients
{
    public class SearchPatientDTO
    {
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public string FullName { get; init; }
        public string DateOfBirth { get; init; }
        public string Gender { get; init; }
        public string MedicalRecordNumber { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public SearchPatientDTO() { }

        public SearchPatientDTO(string firstName, string lastName, string fullName, string dateOfBirth, string gender, string medicalRecordNumber, string email, string phoneNumber)
        {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            DateOfBirth = dateOfBirth;
            Gender = gender;
            MedicalRecordNumber = medicalRecordNumber;
            Email = email;
            PhoneNumber = phoneNumber;
        }
    }
}