using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Specializations;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace DDDSample1.Infrastructure.Specializations
{
    public class SpecializationRepository : BaseRepository<Specialization, SpecializationId>, ISpecializationRepository
    {
        private readonly DDDSample1DbContext _context;

        public SpecializationRepository(DDDSample1DbContext context) : base(context.Specializations)
        {
            _context = context;
        }

        public async Task<Specialization> GetByIdSpecAsync(SpecializationId id, bool includeStaff)
        {
            if (includeStaff)
            {
                return await _context.Specializations
                    .Include(s => s.Staffs)
                    .FirstOrDefaultAsync(s => s.Id == id);
            }
            else
            {
                return await _context.Specializations
                    .FirstOrDefaultAsync(s => s.Id == id);
            }
        }

        public async Task<SpecializationId> GetSpecIdByOptionAsync(string option)
        {
            return await _objs
                .Where(x => x.SpecOption.ToLower() == option.ToLower())
                .Select(x => x.Id)
                .FirstOrDefaultAsync();
        }
    }
}