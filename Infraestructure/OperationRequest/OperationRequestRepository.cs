using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Infrastructure;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.OperationTypes;

public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>, IOperationRequestRepository
{
    private readonly DDDSample1DbContext _context;

    public OperationRequestRepository(DDDSample1DbContext context) : base(context.OperationRequests)
    {
        _context = context;
    }

    public async Task<IEnumerable<OperationRequest>> GetByStatusAsync(string status)
    {
        var requestStatus = Enum.Parse<RequestStatus>(status);
        return await _context.Set<OperationRequest>()
            .Where(r => r.Status == requestStatus)
            .ToListAsync();
    }

    public async Task<IEnumerable<OperationRequest>> GetByDateRangeAsync(DateTime start, DateTime end)
    {
        return await _context.Set<OperationRequest>()
            .Where(r => r.CreatedAt >= start && r.CreatedAt <= end)
            .ToListAsync();
    }

    public async Task<OperationRequest> CreateOperationRequestAsync(CreatingOperationRequestDTO dto)
    {
        var patient = await _context.Patients.FindAsync(dto.PatientId);
        var operationRequest = new OperationRequest(
            new OperationRequestId(Guid.NewGuid()),
            new PatientId(dto.PatientId),      
            new StaffId(dto.StaffId),
            new OperationTypeId(dto.OperationTypeId),
            dto.Deadline,
            RequestStatus.Pending,             
            dto.Priority,
            DateTime.UtcNow,
            patient                    // Add the patient object here
        );

        await AddAsync(operationRequest);
        return operationRequest;
    }

    public async Task<IEnumerable<OperationRequest>> GetByPatientIdAsync(PatientId patientId)
    {
        return await _context.Set<OperationRequest>()
            .Where(r => r.PatientId == patientId)
            .ToListAsync();
    }

    Task<List<OperationRequest>> IOperationRequestRepository.GetByPatientIdAsync(PatientId patientId)
    {
        return _context.Set<OperationRequest>()
            .Where(r => r.PatientId == patientId)
            .ToListAsync();
    }

    public Task<List<OperationRequest>> GetByStaffIdAsync(StaffId staffId)
    {
        return _context.Set<OperationRequest>()
            .Where(r => r.StaffId == staffId)
            .ToListAsync();
    }

    public Task<List<OperationRequest>> GetByOperationTypeIdAsync(OperationTypeId operationTypeId)
    {
        return _context.Set<OperationRequest>()
            .Where(r => r.OperationTypeId == operationTypeId)
            .ToListAsync();
    }

    Task<List<OperationRequest>> IOperationRequestRepository.GetByStatusAsync(string status)
    {
        var requestStatus = Enum.Parse<RequestStatus>(status);
        return _context.Set<OperationRequest>()
            .Where(r => r.Status == requestStatus)
            .ToListAsync();
    }

    public Task<List<OperationRequest>> GetByPriorityAsync(int priority)
    {
        return _context.Set<OperationRequest>()
            .Where(r => r.Priority == (PriorityLevel)priority)
            .ToListAsync();
    }

    public Task RemoveAsync(OperationRequest operationRequest)
    {
        _context.OperationRequests.Remove(operationRequest);
        return _context.SaveChangesAsync();
    }
    public async Task<List<OperationRequest>> SearchOperationRequestsAsync(OperationRequestSearchParams searchParams)
    {
        var query = _context.OperationRequests.AsQueryable();
        
        if (!string.IsNullOrEmpty(searchParams.PatientName))
            query = query.Include(r => r.PatientId)  // Include the Patient navigation property
                        .Where(r => r.PatientId.ToString().Contains(searchParams.PatientName));
            
        if (!string.IsNullOrEmpty(searchParams.OperationType))
            query = query.Where(r => r.OperationTypeId.ToString() == searchParams.OperationType);
            
        if (searchParams.Priority.HasValue)
            query = query.Where(r => r.Priority == (PriorityLevel)searchParams.Priority.Value);
            
        if (searchParams.Status.HasValue)
            query = query.Where(r => r.Status == searchParams.Status);
        
        return await query.ToListAsync();
    }

    public Task<OperationRequest> UpdateOperationRequestAsync(string id, UpdateOperationRequestDTO dto, string doctorId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteOperationRequestAsync(string id)
    {
        throw new NotImplementedException();
    }

    public Task<List<OperationRequest>> GetOperationRequestsByStaffAsync(string staffId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<OperationRequestWithDetails>> SearchOperationRequestsWithDetailsAsync(OperationRequestSearchParams searchParams)
    {
        throw new NotImplementedException();
    }
}
