using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public async Task<SurgeryRoomDTO> CreateSurgeryRoom(CreatingSurgeryRoomDTO dto)
        {
            try
            {
                // Check if RoomNumber is unique
                var existingRoom = await _repo.GetByRoomNumberAsync(dto.RoomNumber);
                if (existingRoom != null)
                {
                    throw new BusinessRuleValidationException($"Room number '{dto.RoomNumber}' already exists.");
                }

                // Map DTO to domain model
                var surgeryRoom = _mapper.ToDomain(dto);

                // Add and commit
                await _repo.AddAsync(surgeryRoom);
                await _unitOfWork.CommitAsync();

                return _mapper.ToDto(surgeryRoom);
            }
            catch (BusinessRuleValidationException e)
            {
                throw new BusinessRuleValidationException(e.Message);
            }
            catch (SystemException ex)
            {
                Console.WriteLine(ex);
                throw new SystemException("An error occurred while creating the surgery room.");
            }

        }

        public async Task<List<SurgeryRoomDTO>> GetRoomsByDate(DateTime date)
        {
            try
            {
                var roomsWithOccupation = new List<SurgeryRoomDTO>();
                var rooms = await _repo.GetAllAsync();
        
                foreach (var room in rooms)
                {
            
                    var isOccupied = room.AppointmentDates.Any(appointmentDate => appointmentDate.Date == date.Date);
                    var roomDTO = _mapper.ToDto(room);
                    roomDTO.isOccupied = isOccupied;
                    roomsWithOccupation.Add(roomDTO);
                }
        
                return roomsWithOccupation;
            }
            catch (BusinessRuleValidationException e)
            {
                throw new BusinessRuleValidationException(e.Message);
            }
            catch (SystemException ex)
            {
                Console.WriteLine(ex);
                throw new SystemException("An error occurred while getting the surgery rooms.");
            }
        }
    }
}
