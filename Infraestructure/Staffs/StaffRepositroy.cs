using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure.Shared;
using System.Linq;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Infrastructure.Staffs
{
    public class StaffRepository : BaseRepository<Staff, StaffId>, IStaffRepository
    {
        private readonly DDDSample1DbContext _context;

        public StaffRepository(DDDSample1DbContext context) : base(context.Staffs)
        {
            _context = context;
        }

        public async Task<IEnumerable<Staff>> GetStaffBySpecializationIdAsync(SpecializationId specializationId)
        {
            return await _context.Staffs
                .Where(s => s.SpecializationId == specializationId)
                .ToListAsync();
        }
    }
}