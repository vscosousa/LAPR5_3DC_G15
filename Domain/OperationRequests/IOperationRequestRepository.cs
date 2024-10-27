using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.OperationRequests
{
    public interface IOperationRequestRepository : IRepository<OperationRequest, OperationRequestId>
    {
        Task<List<OperationRequest>> GetByPatientIdAsync(PatientId patientId);
        Task<List<OperationRequest>> GetByStaffIdAsync(StaffId staffId);
        Task<OperationRequest> CreateOperationRequestAsync(CreatingOperationRequestDTO dto);
        Task<List<OperationRequest>> GetByOperationTypeIdAsync(OperationTypeId operationTypeId);
        Task<OperationRequest> UpdateOperationRequestAsync(string id, UpdateOperationRequestDTO dto, string doctorId);
        Task<bool> DeleteOperationRequestAsync(string id);
        Task<List<OperationRequest>> GetOperationRequestsByStaffAsync(string staffId);
        Task<List<OperationRequest>> GetByStatusAsync(string status);
        Task<List<OperationRequest>> GetByPriorityAsync(int priority);
        
        Task RemoveAsync(OperationRequest operationRequest);
        
        Task<List<OperationRequest>> SearchOperationRequestsAsync(OperationRequestSearchParams searchParams);
        
        Task<IEnumerable<OperationRequestWithDetails>> SearchOperationRequestsWithDetailsAsync(OperationRequestSearchParams searchParams);
    }
}
