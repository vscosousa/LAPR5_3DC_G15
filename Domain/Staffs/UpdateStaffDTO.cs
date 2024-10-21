using System;

namespace DDDSample1.Domain.Staffs
{
    public class UpdateStaffDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AddAvailabilitySlots { get; set; }
        public string RemoveAvailabilitySlots { get; set; }
        public string SpecializationId { get; set; }

        public UpdateStaffDTO() { }

        public UpdateStaffDTO(string firstName, string lastName, string fullName, string email, string phoneNumber, string addSlots,string removeSlots, string specializationId)
        {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            AddAvailabilitySlots = addSlots;
            RemoveAvailabilitySlots = removeSlots;
            SpecializationId = specializationId;
        }
    }
}
