using Projetos.LAPR5_3DC_G15.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using System.Collections.Generic;

namespace Projetos.LAPR5_3DC_G15.Mappers.SurgeryRooms
{
    public class SurgeryRoomMapper : IMapper<SurgeryRoom, SurgeryRoomDTO, CreatingSurgeryRoomDTO>, ISurgeryRoomMapper
    {
        public SurgeryRoom toDomain(SurgeryRoomDTO dto)
        {
            return new SurgeryRoom(dto.roomNumber, dto.type, dto.capacity, dto.equipment, dto.status, dto.roomMaintenance);
        }

    
        public SurgeryRoom toDomain(CreatingSurgeryRoomDTO dto)
        {
            return new SurgeryRoom(
                dto.RoomNumber,
                dto.Type,
                dto.Capacity,
                new List<string>(dto.Equipment),
                dto.Status,
                dto.RoomMaintenance
            );
        }

         public CreatingSurgeryRoomDTO ToCreatingDto(SurgeryRoom domain)
        {
            return new CreatingSurgeryRoomDTO
            {
                RoomNumber = domain.RoomNumber,
                Type = domain.Type,
                Capacity = domain.Capacity,
                Equipment = domain.Equipment.ToArray(),
                Status = domain.Status,
                RoomMaintenance = domain.RoomMaintenance
            };
        }

        public SurgeryRoomDTO ToDto(SurgeryRoom domain)
        {
            return new SurgeryRoomDTO
            {
                roomNumber = domain.RoomNumber,
                type = domain.Type,
                capacity = domain.Capacity,
                equipment = domain.Equipment,
                status = domain.Status,
                roomMaintenance = domain.RoomMaintenance
            };
        }

        public SurgeryRoom ToDomain(CreatingSurgeryRoomDTO dto)
        {
            return new SurgeryRoom(
                dto.RoomNumber,
                dto.Type,
                dto.Capacity,
                new List<string>(dto.Equipment),
                dto.Status,
                dto.RoomMaintenance
            );
        }
    }
}