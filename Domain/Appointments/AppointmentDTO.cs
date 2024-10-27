using System;

namespace DDDSample1.Domain.Appointments
{
    public class AppointmentDTO
    {
        public Guid Id { get; init; }
        public string DateTime { get; init; }
        public string Status { get; init; }
        public Guid RequestId { get; init; }
        public Guid RoomId { get; init; }

        public AppointmentDTO()
        {
        }

        public AppointmentDTO(Guid id, string dateTime, string status, Guid requestId, Guid roomId)
        {
            Id = id;
            DateTime = dateTime;
            Status = status;
            RequestId = requestId;
            RoomId = roomId;
        }
    }
}