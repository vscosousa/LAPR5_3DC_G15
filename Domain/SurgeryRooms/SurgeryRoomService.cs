using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRoomRepository _repo;
        private readonly ISurgeryRoomMapper _mapper;

        public SurgeryRoomService(IUnitOfWork unitOfWork, ISurgeryRoomRepository repo, ISurgeryRoomMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _mapper = mapper;
        }
    }
}
