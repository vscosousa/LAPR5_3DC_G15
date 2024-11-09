using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Specializations;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Infrastructure.Specializations
{
    public class SpecializationRepository : BaseRepository<Specialization, SpecializationId>, ISpecializationRepository
    {
        public SpecializationRepository(DDDSample1DbContext context) : base(context.Specializations)
        {
        }

        public async Task<Specialization> GetByIdSpecAsync(SpecializationId id, bool includeStaff)
        {
            if (includeStaff)
            {
                return await _objs
                    .Include(s => s.Staffs)
                    .FirstOrDefaultAsync(s => s.Id == id);
            }
            else
            {
                return await _objs
                    .FirstOrDefaultAsync(s => s.Id == id);
            }
        }

        public async Task<Specialization> GetSpecIdByOptionAsync(string option)
        {
            return await _objs
                .Where(x => x.SpecOption.ToLower() == option.ToLower())
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Staff>> GetStaffBySpecializationAsync(string specOption)
        {
            var specialization = await _objs
                .Include(s => s.Staffs)
                .Where(x => x.SpecOption.ToLower() == specOption.ToLower())
                .FirstOrDefaultAsync();

            return specialization.Staffs;
        }
    }
}