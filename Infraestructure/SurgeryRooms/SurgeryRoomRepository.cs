using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Infrastructure.Shared;
using Domain.SurgeryRooms;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.SurgeryRooms
{
    public class SurgeryRoomRepository : BaseRepository<SurgeryRoom, SurgeryRoomId>, ISurgeryRoomRepository
    {
        private readonly DDDSample1DbContext _context;

        public SurgeryRoomRepository(DDDSample1DbContext context) : base(context.SurgeryRooms)
        {
            _context = context;
        }

        public new async Task<IEnumerable<SurgeryRoom>> GetAllAsync()
        {
            return await _context.SurgeryRooms.ToListAsync();
        }

        public Task<List<SurgeryRoom>> GetByCapacityAsync(int minCapacity)
        {
            throw new System.NotImplementedException();
        }

        public async Task<SurgeryRoom> GetByNameAsync(string name)
        {
            return await _context.SurgeryRooms
                .FirstOrDefaultAsync(sr => sr.Number == int.Parse(name));
        }

        public Task<SurgeryRoom> GetByNumberAsync(int number)
        {
            throw new System.NotImplementedException();
        }

        public async Task<List<SurgeryRoom>> GetByStatusAsync(bool status)
        {
            return await _context.SurgeryRooms
                .Where(sr => sr.Status == RoomStatus.Available) 
                .ToListAsync();
        }

        public Task<List<SurgeryRoom>> GetByStatusAsync(RoomStatus status)
        {
            throw new System.NotImplementedException();
        }
    }
}
