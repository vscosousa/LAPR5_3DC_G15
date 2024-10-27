using System;
using System.Collections.Generic;

namespace Domain.SurgeryRooms
{
    public class SurgeryRoomDTO
    {
        public Guid Id { get; set; }
        public int Number { get; set; }
        public string Type { get; set; }
        public int Capacity { get; set; }
        public List<string> AssignedEquipment { get; set; }
        public RoomStatus Status { get; set; }
        public List<string> MaintenanceSlots { get; set; }

        public SurgeryRoomDTO(Guid id, int number, string type, int capacity, List<string> assignedEquipment, RoomStatus status, List<string> maintenanceSlots)
        {
            Id = id;
            Number = number;
            Type = type;
            Capacity = capacity;
            AssignedEquipment = assignedEquipment;
            Status = status;
            MaintenanceSlots = new List<string>();
        }
    }
}
