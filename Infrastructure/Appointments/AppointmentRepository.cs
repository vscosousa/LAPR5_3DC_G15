using DDDSample1.Domain.Appointments;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Appointments
{
    public class AppointmentRepository : BaseRepository<Appointment, AppointmentId>, IAppointmentRepository
    {
        public AppointmentRepository(DDDSample1DbContext context) : base(context.Appointments)
        {
        }
    }
}