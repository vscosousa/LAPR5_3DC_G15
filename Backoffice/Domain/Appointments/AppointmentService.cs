using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _repo;
        private readonly IAppointmentMapper _mapper;

        public AppointmentService(IUnitOfWork unitOfWork, IAppointmentRepository repo, IAppointmentMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _mapper = mapper;
        }
    }
}
