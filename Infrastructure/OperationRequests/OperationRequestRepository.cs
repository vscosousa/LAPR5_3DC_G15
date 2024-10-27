using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.OperationRequests
{
    public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>, IOperationRequestRepository
    {
        public OperationRequestRepository(DDDSample1DbContext context) : base(context.OperationRequests)
        {
        }

        public async Task<List<OperationRequest>> SearchOperationRequestsAsync(SearchOperationRequestDTO dto)
        {
            var query = _objs.AsQueryable();

            if (!string.IsNullOrEmpty(dto.OperationType))
                query = query.Where(p => p.OperationType.Name == dto.OperationType);

            if (!string.IsNullOrEmpty(dto.PatientName))
                query = query.Where(p => p.Patient.FullName == dto.PatientName);

            if (!string.IsNullOrEmpty(dto.Status))
                query = query.Where(p => p.Status.ToString() == dto.Status);

            if (!string.IsNullOrEmpty(dto.Priority))
                query = query.Where(p => p.Priority.ToString() == dto.Priority);

            return await query.ToListAsync();
        }
    }
}