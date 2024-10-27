using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using Domain.SurgeryRooms;

namespace DDDSample1.Domain.SurgeryRooms
{
    public interface ISurgeryRoomRepository : IRepository<SurgeryRoom, SurgeryRoomId>
    {
        Task<SurgeryRoom> GetByNumberAsync(int number);
        Task<List<SurgeryRoom>> GetByStatusAsync(RoomStatus status);
        Task<List<SurgeryRoom>> GetByCapacityAsync(int minCapacity);
    }
}
