using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Infrastructure.Shared;
using Domain.SurgeryRooms;
using System.Collections.Generic;
using System.Linq;

namespace DDDSample1.Infrastructure.SurgeryRooms
{
    public class SurgeryRoomMapper
    {
        public static SurgeryRoom ToDomain(SurgeryRoomDTO dto)
        {
            return new SurgeryRoom(
                dto.Number,
                dto.Type,
                dto.Capacity,
                dto.AssignedEquipment ?? new List<string>(),
                dto.MaintenanceSlots ?? new List<string>()
            );
        }

        public static SurgeryRoomDTO ToDTO(SurgeryRoom domain)
        {
            return new SurgeryRoomDTO(
                domain.Id.AsGuid(),
                domain.Number,
                domain.Type,
                domain.Capacity,
                domain.AssignedEquipment,
                domain.Status,
                domain.MaintenanceSlots.Select(slot => slot.ToString()).ToList()
            );
        }
    }
}
