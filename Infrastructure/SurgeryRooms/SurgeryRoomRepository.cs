using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.SurgeryRooms
{
    public class SurgeryRoomRepository : BaseRepository<SurgeryRoom, SurgeryRoomId>, ISurgeryRoomRepository
    {
        public SurgeryRoomRepository(DDDSample1DbContext context) : base(context.SurgeryRooms)
        {
        }
    }
}