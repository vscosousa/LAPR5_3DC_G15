using System;

namespace DDDSample1.Domain.Staffs
{
    public class UpdateStaffDTO
    {
        public string PhoneNumber { get; set; }
        public string AddAvailabilitySlots { get; set; }
        public string RemoveAvailabilitySlots { get; set; }
        public string SpecializationId { get; set; }

        public UpdateStaffDTO() { }

        public UpdateStaffDTO(string phoneNumber, string addSlots,string removeSlots, string specializationId)
        {
            PhoneNumber = phoneNumber;
            AddAvailabilitySlots = addSlots;
            RemoveAvailabilitySlots = removeSlots;
            SpecializationId = specializationId;
        }
    }
}
