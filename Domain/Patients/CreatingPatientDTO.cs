namespace DDDSample1.Domain.Patients
{
    public class CreatingPatientDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string[] FullName { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        public int MedicalRecordNumber { get; set; }
        public string Email { get; set; }
        public string CountryIdentifier { get; set; }
        public string PhoneNumber { get; set; }
        public string EmergencyCountryIdentifier { get; set; }
        public string EmergencyPhoneNumber { get; set; }
        public string[] MedicalConditions { get; set; }
        public string DateOfAppointment { get; set; }
        public string TimeOfAppointment { get; set; }

        public CreatingPatientDTO() { }

        public CreatingPatientDTO(string firstName, string lastName, string[] fullName, string dateOfBirth, string gender, int medicalRecordNumber, string email, string countryIdentifier, string phoneNumber, string emergencyCountryIdentifier, string emergencyPhoneNumber, string[] medicalConditions, string dateOfAppointment, string timeOfAppointment)
        {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            DateOfBirth = dateOfBirth;
            Gender = gender;
            MedicalRecordNumber = medicalRecordNumber;
            Email = email;
            CountryIdentifier = countryIdentifier;
            PhoneNumber = phoneNumber;
            EmergencyCountryIdentifier = emergencyCountryIdentifier;
            EmergencyPhoneNumber = emergencyPhoneNumber;
            MedicalConditions = medicalConditions;
            DateOfAppointment = dateOfAppointment;
            TimeOfAppointment = timeOfAppointment;
        }
    }
}