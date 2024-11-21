using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.SurgeryRooms
{
    public interface ISurgeryRoomRepository : IRepository<SurgeryRoom, SurgeryRoomId>
    {
        Task<IEnumerable<SurgeryRoom>> GetByDateAsync(DateTime date);
        Task<SurgeryRoom> GetByRoomNumberAsync(string roomNumber);
    }
}