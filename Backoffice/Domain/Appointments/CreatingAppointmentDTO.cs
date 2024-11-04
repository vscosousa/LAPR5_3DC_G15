using System;

namespace DDDSample1.Domain.Appointments
{
    public class CreatingAppointmentDTO
    {
        public DateTime DateTime { get; init; }
        public Guid RequestId { get; init; }
        public Guid RoomId { get; init; }
        public CreatingAppointmentDTO() { }

        public CreatingAppointmentDTO(DateTime dateTime, Guid requestId, Guid roomId)
        {
            DateTime = dateTime;
            RequestId = requestId;
            RoomId = roomId;
        }
    }
}