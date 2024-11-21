using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Infrastructure.Shared;
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


        public async Task<SurgeryRoom> GetByRoomNumberAsync(string roomNumber)
        {
            return await _context.SurgeryRooms
                .FirstOrDefaultAsync(sr => sr.RoomNumber == roomNumber);
        }

        public async Task<IEnumerable<SurgeryRoom>> GetByDateAsync(DateTime date)
        {
            return await _context.SurgeryRooms
                .Where(sr => sr.AppointmentDates.Contains(date))
                .ToListAsync();
        }
    }
}