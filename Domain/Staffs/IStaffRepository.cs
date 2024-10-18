using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Domain.Staffs
{
    public interface IStaffRepository : IRepository<Staff, StaffId>
    {
        Task<IEnumerable<Staff>> GetStaffBySpecializationIdAsync(SpecializationId specializationId);
    }
}