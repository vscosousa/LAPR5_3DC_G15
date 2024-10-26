using System;

namespace DDDSample1.Domain.Staffs
{
    public class UpdateStaffDTO
    {
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string AddAvailabilitySlots { get; set; }
        public string RemoveAvailabilitySlots { get; set; }
        public string SpecializationName { get; set; }
        public Guid SpecializationId { get; private set; }

        public UpdateStaffDTO() { }

        public UpdateStaffDTO(string phoneNumber, string email, string addSlots,string removeSlots, string specializationName)
        {
            PhoneNumber = phoneNumber;
            Email = email;
            AddAvailabilitySlots = addSlots;
            RemoveAvailabilitySlots = removeSlots;
            SpecializationName = specializationName;
        }

        public void SetSpecializationId(Guid specializationId)
        {
            SpecializationId = specializationId;
        }

        public void SetPhoneNumber(string phoneNumber)
        {
            PhoneNumber = phoneNumber;
        }

        public void SetEmail(string email)
        {
            Email = email;
        }
    }
}
