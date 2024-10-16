using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Domain.Staffs
{
    public class Staff : Entity<StaffId>, IAggregateRoot
    {
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string FullName { get; private set; }
        public string LicenseNumber { get; private set; }
        public string Email { get; private set; }
        public string PhoneNumber { get; private set; }
        public DateTime[] AvailabilitySlots { get; private set; }

        // Foreign key property
        public SpecializationId SpecializationId { get; private set; }

        // Navigation property
        [JsonIgnore]
        public Specialization Specialization { get; private set; }
        
        public Staff(string firstName, string lastName, string fullName, string licenseNumber, string email, string phoneNumber, DateTime[] availabilitySlots, SpecializationId specializationId)
        {
            Id = new StaffId(Guid.NewGuid());
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            LicenseNumber = licenseNumber;
            Email = email;
            PhoneNumber = phoneNumber;
            AvailabilitySlots = availabilitySlots;
            SpecializationId = specializationId; 
        }

        // Method to set the navigation property after creation
        public void SetSpecialization(Specialization specialization)
        {
           Specialization = specialization;
        }
    }
}
