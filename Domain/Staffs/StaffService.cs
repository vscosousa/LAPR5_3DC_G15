using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _repository;

        private readonly ISpecializationRepository _specializationRepository;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repository, ISpecializationRepository specializationRepository)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _specializationRepository = specializationRepository;
        }
        
    }
}