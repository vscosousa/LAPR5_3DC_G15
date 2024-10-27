using System;
using System.Collections.Generic;

namespace Domain.SurgeryRooms
{
    public class SurgeryRoomEvent
    {
        public Guid Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string SurgeryType { get; set; }
        public string PatientId { get; set; }
        public string StaffId { get; set; }
        public List<string> RequiredEquipment { get; set; }
        public EventStatus Status { get; set; }
        public string Notes { get; set; }
    }

    public enum EventStatus
    {
        Scheduled,
        InProgress,
        Completed,
        Cancelled
    }
}
