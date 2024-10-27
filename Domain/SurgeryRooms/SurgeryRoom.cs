using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoom: Entity<SurgeryRoomId>, IAggregateRoot
    {
        //Primary Key
       private string _roomNumber;
       private string _type;
       private int _capacity;
       private List<string> _equipment;
       private SurgeryRoomStatus _status;

       private DateTime[] _roomMaintenance;

         public SurgeryRoom(string roomNumber, string type, int capacity, List<string> equipment, SurgeryRoomStatus status, DateTime[] roomMaintenance)
         {
            Id = new SurgeryRoomId(Guid.NewGuid());
            _roomNumber = roomNumber;
            _type = type;
            _capacity = capacity;
            _equipment = equipment;
            _status = status;
            _roomMaintenance = roomMaintenance;
         }


        public string RoomNumber => _roomNumber;
        public string Type => _type;
        public int Capacity => _capacity;
        public List<string> Equipment => _equipment;
        public SurgeryRoomStatus Status => _status;
        public DateTime[] RoomMaintenance => _roomMaintenance;

    }
}