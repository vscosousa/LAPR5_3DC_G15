using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace DDDSample1.Domain.Appointments
{
    public interface IAppointmentMapper : IMapper<Appointment, AppointmentDTO, CreatingAppointmentDTO>
    {
    }
}