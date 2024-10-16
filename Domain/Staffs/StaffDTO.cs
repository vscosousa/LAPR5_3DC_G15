using System;

namespace DDD.sample1.Domain.Staffs
{
    public class StaffDTO{

        public Guid id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string FullName { get; set; }

        public string LicenseNumber { get; set; }

        public string SpecOption { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public DateTime[] AvailabilitySlots { get; set; }


        public StaffDTO() { }

        public StaffDTO(Guid id, string firstName, string lastName, string fullName, string email, string phoneNumber, string specOption, string licenseNumber, DateTime[] availabilitySlots)
        {
            this.id = id;
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            SpecOption = specOption;
            LicenseNumber = licenseNumber;
            AvailabilitySlots = availabilitySlots;
        }

        
    }
}