using System;

namespace DDD.Sample1.Domain.Staffs
{
    public class StaffDTO{

        public Guid id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string FullName { get; set; }

        public string LicenseNumber { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public DateTime[] AvailabilitySlots { get; set; }


        public StaffDTO() { }

        public StaffDTO(Guid id, string firstName, string lastName, string fullName, string email, string phoneNumber, string licenseNumber, DateTime[] availabilitySlots)
        {
            this.id = id;
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            LicenseNumber = licenseNumber;
            AvailabilitySlots = availabilitySlots;
        }

        
    }
}