using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staffs
{
    public interface IStaffRepository : IRepository<Staff, StaffId>
    {
    }
}