using System;
using System.Threading.Tasks;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _repo;
        private readonly IAppointmentMapper _mapper;

        private readonly IOperationRequestRepository _requestRepository;

        private readonly ISurgeryRoomRepository _surgeryRoomRepository;

        public AppointmentService(IUnitOfWork unitOfWork, IAppointmentRepository repo, IAppointmentMapper mapper, IOperationRequestRepository requestRepository, ISurgeryRoomRepository surgeryRoomRepository)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _mapper = mapper;
            _requestRepository = requestRepository;
            _surgeryRoomRepository = surgeryRoomRepository;
        }


        // Method to create an appointment
        public async Task<AppointmentDTO> CreateAppointment(CreatingAppointmentDTO dto)
        {
            try{
                var appointmentRequest = _mapper.ToDomain(dto);
                var request = await _requestRepository.GetByIdAsync(appointmentRequest.RequestId);
                if (request == null)
                {
                    throw new BusinessRuleValidationException("The request does not exist in the system.");
                }

                var surgeryRoom = await _surgeryRoomRepository.GetByIdAsync(appointmentRequest.RoomId);
                if (surgeryRoom == null)
                {
                    throw new BusinessRuleValidationException("The surgery room does not exist in the system.");
                }

                await _repo.AddAsync(appointmentRequest);
                
                surgeryRoom.setAppointmentDates(appointmentRequest.DateTime);

                await _unitOfWork.CommitAsync();

                return _mapper.ToDto(appointmentRequest);

            } catch (BusinessRuleValidationException e)
            {
                throw new BusinessRuleValidationException(e.Message);

            } catch (SystemException)

            {
               throw new SystemException("An error occurred while creating the appointment.");
            }
        }
    }
}
