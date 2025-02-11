namespace DDDSample1.Domain.Patients
{
    public class CreatingPatientDTO
    {
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public string FullName { get; init; }
        public string DateOfBirth { get; init; }
        public GenderOptions GenderOptions { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public string EmergencyContact { get; init; }
        public string[] Allergies { get; init; }
        public string[] MedicalConditions { get; init; }
        public string[] FamilyHistory { get; init; }
        public string FreeText { get; init; }


        public CreatingPatientDTO() { }

        public CreatingPatientDTO(string firstName, string lastName, string fullName, string dateOfBirth, GenderOptions gender, string email, string phoneNumber, string emergencyContact, string[] allergies, string[] medicalConditions, string[] familyHistory, string freeText)
        {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            DateOfBirth = dateOfBirth;
            GenderOptions = gender;
            Email = email;
            PhoneNumber = phoneNumber;
            EmergencyContact = emergencyContact;
            Allergies = allergies;
            MedicalConditions = medicalConditions;
            FamilyHistory = familyHistory;
            FreeText = freeText;
        }
    }
}