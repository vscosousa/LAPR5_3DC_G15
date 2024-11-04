using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.SurgeryRooms;
using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace Projetos.LAPR5_3DC_G15.Mappers.Patients
{
    public class AppointmentMapper : IMapper<Appointment, AppointmentDTO, CreatingAppointmentDTO>, IAppointmentMapper
    {
        public AppointmentDTO ToDto(Appointment domain)
        {
            return new AppointmentDTO
            {
                Id = domain.Id.AsGuid(),
                DateTime = domain.DateTime.ToString(),
                Status = domain.Status.ToString(),
                RequestId = domain.RequestId.AsGuid(),
                RoomId = domain.RoomId.AsGuid()
            };
        }

        public Appointment ToDomain(CreatingAppointmentDTO dto)
        {
            return new Appointment(
                dto.DateTime,
                new OperationRequestId(dto.RequestId),
                new SurgeryRoomId(dto.RoomId)
            );
        }

        public CreatingAppointmentDTO ToCreatingDto(Appointment domain)
        {
            return new CreatingAppointmentDTO
            {
                DateTime = domain.DateTime,
                RequestId = domain.RequestId.AsGuid(),
                RoomId = domain.RoomId.AsGuid()
            };
        }
    }
}