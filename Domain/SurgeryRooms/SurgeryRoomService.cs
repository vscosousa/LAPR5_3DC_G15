using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.Shared;

namespace Domain.SurgeryRooms
{
    public class SurgeryRoomService
    {
        private readonly ISurgeryRoomRepository _repo;

        public SurgeryRoomService(ISurgeryRoomRepository repo)
        {
            _repo = repo;
        }

        public async Task<SurgeryRoomDTO> GetByIdAsync(SurgeryRoomId id)
        {
            var surgeryRoom = await _repo.GetByIdAsync(id);
            
            if (surgeryRoom == null)
                throw new BusinessRuleValidationException("Surgery room not found.");

            return new SurgeryRoomDTO(
                surgeryRoom.Id.AsGuid(),
                surgeryRoom.Number,
                surgeryRoom.Type,
                surgeryRoom.Capacity,
                surgeryRoom.AssignedEquipment,
                surgeryRoom.Status,
                surgeryRoom.MaintenanceSlots.ConvertAll(slot => slot.ToString())
            );
        }

        public async Task<List<SurgeryRoomDTO>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            
            List<SurgeryRoomDTO> listDTO = list.ConvertAll<SurgeryRoomDTO>(surgeryRoom => 
                new SurgeryRoomDTO(
                    surgeryRoom.Id.AsGuid(),
                    surgeryRoom.Number,
                    surgeryRoom.Type,
                    surgeryRoom.Capacity,
                    surgeryRoom.AssignedEquipment,
                    surgeryRoom.Status,
                    surgeryRoom.MaintenanceSlots.ConvertAll(slot => slot.ToString())
                ));

            return listDTO;
        }

        public async Task<SurgeryRoomDTO> AddAsync(CreatingSurgeryRoomDTO dto)
        {
            var surgeryRoom = new SurgeryRoom(dto.Number, dto.Type, dto.Capacity, dto.AssignedEquipment, new List<string> { dto.Status });
            await _repo.AddAsync(surgeryRoom);
            return new SurgeryRoomDTO(
                surgeryRoom.Id.AsGuid(),
                surgeryRoom.Number,
                surgeryRoom.Type,
                surgeryRoom.Capacity,
                surgeryRoom.AssignedEquipment,
                surgeryRoom.Status,
                surgeryRoom.MaintenanceSlots.ConvertAll(slot => slot.ToString())
            );
        }
    }
}
