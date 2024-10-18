namespace DDDSample1.Domain.Patients
{
    public class CreatingPatientDTO
    {
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public string FullName { get; init; }
        public string DateOfBirth { get; init; }
        public GenderOptions Gender { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public string EmergencyContact { get; init; }
        public string MedicalConditions { get; init; }
        public string[] AppointmentHistory { get; init; }

        public CreatingPatientDTO() { }

        public CreatingPatientDTO(string firstName, string lastName, string fullName, string dateOfBirth, GenderOptions gender, string email, string phoneNumber, string emergencyContact, string medicalConditions, string[] appointmentHistory)
        {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            DateOfBirth = dateOfBirth;
            Gender = gender;
            Email = email;
            PhoneNumber = phoneNumber;
            EmergencyContact = emergencyContact;
            MedicalConditions = medicalConditions;
            AppointmentHistory = appointmentHistory;
        }
    }
}