using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Appointments
{
    public class Appointment : Entity<AppointmentId>, IAggregateRoot
    {
        private DateTime _dateTime;
        private AppointmentStatus _status;
        private OperationRequestId _requestId;
        private SurgeryRoomId _roomId;

        [JsonIgnore]
        private OperationRequest _request;

        [JsonIgnore]
        private SurgeryRoom _room;

        // Parameterless constructor for EF Core
        private Appointment() { }

        public Appointment(DateTime dateTime, OperationRequestId requestId, SurgeryRoomId roomId)
        {
            if (dateTime < DateTime.Now)
                throw new BusinessRuleValidationException("Appointment date must be in the future.");

            Id = new AppointmentId(Guid.NewGuid());
            _dateTime = dateTime;
            _status = AppointmentStatus.Scheduled;
            _requestId = requestId;
            _roomId = roomId;
        }

        public DateTime DateTime => _dateTime;
        public AppointmentStatus Status => _status;
        public OperationRequestId RequestId => _requestId;
        public SurgeryRoomId RoomId => _roomId;
        public OperationRequest Request => _request;
        public SurgeryRoom Room => _room;
    }
}