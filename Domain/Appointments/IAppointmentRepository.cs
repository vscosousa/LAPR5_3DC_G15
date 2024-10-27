using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Appointments
{
    public interface IAppointmentRepository : IRepository<Appointment, AppointmentId>
    {
    }
}