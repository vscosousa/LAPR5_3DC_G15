using System;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class CreatingSurgeryRoomDTO
    {


        public string RoomNumber { get; set; }
        public string Type { get; set; }
        public int Capacity { get; set; }
        public string[] Equipment { get; set; }
        public SurgeryRoomStatus Status { get; set; }
        public DateTime[] RoomMaintenance { get; set; }


        public CreatingSurgeryRoomDTO()
        {
        }

        public CreatingSurgeryRoomDTO(string roomNumber, string type, int capacity, string[] equipment, SurgeryRoomStatus status, DateTime[] roomMaintenance)
        {
            this.RoomNumber = roomNumber;
            this.Type = type;
            this.Capacity = capacity;
            this.Equipment = equipment;
            this.Status = status;
            this.RoomMaintenance = roomMaintenance;
        }
    }
}