using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.OperationTypes
{
    public class OperationTypeRepository : BaseRepository<OperationType, OperationTypeId>, IOperationTypeRepository
    {
        private readonly DDDSample1DbContext _context;

        public OperationTypeRepository(DDDSample1DbContext context) : base(context.OperationTypes)
        {
            _context = context;
        }

         public async Task<IEnumerable<OperationType>> GetAllOpAsync()
        {
            return await _context.OperationTypes
                .Include(o => o.Specializations)
                    .ThenInclude(s => s.Staffs)  
                .ToListAsync();
        }
        public async Task<OperationType> GetByNameAsync(string name)
        {
            return await _context.OperationTypes
            .Include(o => o.Specializations)
                .ThenInclude(s => s.Staffs)
            .FirstOrDefaultAsync(ot => ot.Name == name);
        }

        public async Task<List<OperationType>> GetOpByStatusAsync(bool status)
        {

            return await _context.OperationTypes
            .Where(o => o.IsActive == status)
            .ToListAsync();

        }

        public async Task<OperationType> GetOpStaffByIdAsync(OperationTypeId operationTypeId, bool includeStaff)
        {

            if (includeStaff)
            {
                return await _context.OperationTypes
                    .Include(o => o.Specializations) // Include specializations
                        .ThenInclude(s => s.Staffs)  // Include staffs related to each specialization
                    .FirstOrDefaultAsync(o => o.Id == operationTypeId);
            }
            else
            {
                return await _context.OperationTypes
                    .Include(o => o.Specializations) // Include specializations
                    .FirstOrDefaultAsync(o => o.Id == operationTypeId);
            }
        }

    }
}