using System;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Domain.Staffs
{
    public class StaffDTO{

        public Guid Id { get; init; }
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public string FullName { get; init; }
        public string LicenseNumber { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public Guid SpecializationId { get; init; }
        public string[] AvailabilitySlots { get; init; }
        public bool IsActive { get; init; }

        public StaffDTO() { }

        public StaffDTO(Guid id, string firstName, string lastName, string fullName, string email, string phoneNumber, string licenseNumber, string[] availabilitySlots, Guid specializationId, bool isActive )
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            LicenseNumber = licenseNumber;
            AvailabilitySlots = availabilitySlots;
            SpecializationId = specializationId;
            IsActive = isActive;
        }
    }
}