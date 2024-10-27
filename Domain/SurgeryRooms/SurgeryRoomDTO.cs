using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomDTO
    {
        public string roomNumber { get; set; }
        public string type { get; set; }
        public int capacity { get; set; }
        public List<string> equipment { get; set; }
        public SurgeryRoomStatus status { get; set; }
        public DateTime[] roomMaintenance { get; set; }

        public SurgeryRoomDTO(string roomNumber, string type, int capacity, List<string> equipment, SurgeryRoomStatus status, DateTime[] roomMaintenance)
        {
            this.roomNumber = roomNumber;
            this.type = type;
            this.capacity = capacity;
            this.equipment = equipment;
            this.status = status;
            this.roomMaintenance = roomMaintenance;
        }

        public SurgeryRoomDTO(){}
    }

}