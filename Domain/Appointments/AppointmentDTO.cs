using System;
using System.Collections.Generic;
using Domain.Appointments;

namespace DDDSample1.Domain.Appointments
{
    public class AppointmentDTO
    {
        public Guid Id { get; set; }
        public DateTime DateTime { get; set; }
        public Guid PatientId { get; set; }
        public Guid StaffId { get; set; }
        public Guid SurgeryRoomId { get; set; }
        public AppointmentStatus Status { get; set; }
        public ICollection<Guid> AssignedStaffIds { get; set; }

        public AppointmentDTO( Guid id,Guid requestId,  
            Guid roomId,DateTime dateTime, string status, ICollection<Guid> assignedStaffIds)
        {
            Id = id;
            PatientId = requestId;
            SurgeryRoomId = roomId; 
            DateTime = dateTime;
            Status = Enum.Parse<AppointmentStatus>(status);
            AssignedStaffIds = assignedStaffIds;
        }
    }
}
