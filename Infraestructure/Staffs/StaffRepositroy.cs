using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Staffs
{
    public class StaffRepository : BaseRepository<Staff, StaffId>, IStaffRepository
    {
        public StaffRepository(DDDSample1DbContext context) : base(context.Staffs)
        {
        }
    }
}
