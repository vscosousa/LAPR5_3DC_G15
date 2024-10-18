using System;

namespace DDDSample1.Domain.Staffs
{
    public class CreatingStaffDTO
    {

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string LicenseNumber { get; set; }

        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public DateTime[] AvailabilitySlots { get; set; }

        public CreatingStaffDTO(string firstName, string lastName, string fullName, string licenseNumber, string email, string phoneNumber, DateTime[] availabilitySlots){
        
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            LicenseNumber = licenseNumber;
            Email = email;
            PhoneNumber = phoneNumber;
            AvailabilitySlots = availabilitySlots;
        }
    }
}
