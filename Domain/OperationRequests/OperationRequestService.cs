using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Logs;
using System.Linq;
using DDDSample1.Domain.Events;

#nullable enable

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repository;
        private readonly IPatientRepository _patientRepository;
        private readonly IStaffRepository _staffRepository;
        private readonly IOperationTypeRepository _operationTypeRepository;
        private readonly ILogRepository _logRepository;
    
        private readonly IPlanningModuleNotifier _planningModuleNotifier;

        public OperationRequestService(
            IUnitOfWork unitOfWork,
            IOperationRequestRepository repository,
            IPatientRepository patientRepository,
            IStaffRepository staffRepository,
            IOperationTypeRepository operationTypeRepository,
            ILogRepository logRepository,
            IPlanningModuleNotifier planningModuleNotifier)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _patientRepository = patientRepository;
            _staffRepository = staffRepository;
            _operationTypeRepository = operationTypeRepository;
            _logRepository = logRepository;
            _planningModuleNotifier = planningModuleNotifier;
        }

        public async Task<OperationRequestDTO> CreateOperationRequestAsync(CreatingOperationRequestDTO dto)
        {
            // Validate all required fields are present
            if (string.IsNullOrEmpty(dto.PatientId) || string.IsNullOrEmpty(dto.StaffId) || 
                string.IsNullOrEmpty(dto.OperationTypeId) || dto.Deadline == default || dto.Priority == default)
            {
                throw new ArgumentException("All required fields must be provided.");
            }

            // Validate doctor exists and is active
            var staff = await _staffRepository.GetByIdAsync(new StaffId(dto.StaffId));
            if (staff == null || !staff.IsActive)
                throw new BusinessRuleValidationException("Invalid or inactive doctor");

            // Validate patient exists
            var patient = await _patientRepository.GetByIdAsync(new PatientId(dto.PatientId));
            if (patient == null)
                throw new BusinessRuleValidationException("Invalid patient");

            // Validate operation type exists and is active
            var operationType = await _operationTypeRepository.GetByIdAsync(new OperationTypeId(dto.OperationTypeId));
            if (operationType == null || !operationType.IsActive)
                throw new BusinessRuleValidationException("Invalid or inactive operation type");

            // Validate staff's specialization matches operation type
            bool hasRequiredSpecialization = operationType.Specializations
                .Any(s => staff.Specialization.Id.Equals(s.Id));
            if (!hasRequiredSpecialization)
                throw new BusinessRuleValidationException("Staff's specialization does not match operation type requirements");

            // Create operation request
            var request = new OperationRequest(
                new OperationRequestId(Guid.NewGuid()),  // Add new ID
                new PatientId(dto.PatientId),
                new StaffId(dto.StaffId),
                new OperationTypeId(dto.OperationTypeId),
                dto.Deadline,
                RequestStatus.Pending,
                dto.Priority,
                DateTime.Now,
                patient  // Add the patient object here
            );

            // Save request
            await _repository.AddAsync(request);  // Changed from CreateOperationRequestAsync to AddAsync

            // Create log entry
            var log = new Log(
                TypeOfAction.Create,
                request.Id.ToString(),
                $"Operation request created for patient {patient.FullName} by Dr. {staff.FullName}"
            );
            await _logRepository.AddAsync(log);

    

            await _unitOfWork.CommitAsync();

            // Return DTO
            return new OperationRequestDTO(
                request.Id.AsGuid(),
                request.PatientId.ToString(),
                request.StaffId.ToString(),
                request.OperationTypeId.AsGuid().ToString(),
                request.Deadline,
                request.Priority,
                request.CreatedAt,
                request.Status,
                request.Patient  // Add this parameter
            );
        }

        public async Task<OperationRequest> GetOperationRequestByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(new OperationRequestId(Guid.Parse(id)));
        }

        public async Task<List<OperationRequest>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<OperationRequest> UpdateOperationRequestAsync(string id, UpdateOperationRequestDTO dto, string requestingDoctorId)
        {
            var existingRequest = await _repository.GetByIdAsync(new OperationRequestId(Guid.Parse(id)));
            if (existingRequest == null)
                throw new KeyNotFoundException($"Operation Request with id {id} not found.");

            // Validate requesting doctor is the original creator
            if (existingRequest.StaffId.ToString() != requestingDoctorId)
                throw new UnauthorizedAccessException("Only the requesting doctor can update this operation request.");

            // Store old values for logging
            var oldDeadline = existingRequest.Deadline;
            var oldPriority = existingRequest.Priority;

            // Update the existing request
            existingRequest.UpdateDetails(
                new PatientId(dto.PatientId),
                new StaffId(dto.StaffId),
                new OperationTypeId(dto.OperationTypeId),
                dto.Deadline ?? throw new ArgumentException("Deadline cannot be null"),
                dto.Priority
            );

            // Log changes
            var changes = new List<string>();
            if (oldDeadline != dto.Deadline) changes.Add($"Deadline changed from {oldDeadline} to {dto.Deadline}");
            if (oldPriority != dto.Priority) changes.Add($"Priority changed from {oldPriority} to {dto.Priority}");

            var log = new Log(
                TypeOfAction.Update,
                existingRequest.Id.ToString(),
                $"Operation request updated: {string.Join(", ", changes)}"
            );
            await _logRepository.AddAsync(log);

        

            // Notify planning module
            await _planningModuleNotifier.NotifyOperationRequestUpdateAsync(existingRequest);

            await _repository.UpdateAsync(existingRequest);
            await _unitOfWork.CommitAsync();

            return existingRequest;
        }

        public async Task<OperationRequest> GetByIdAsync(OperationRequestId id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<bool> DeleteOperationRequestAsync(string id, string requestingDoctorId)
        {
            var operationRequest = await _repository.GetByIdAsync(new OperationRequestId(Guid.Parse(id)));
            
            if (operationRequest == null)
                return false;

            // Check if requesting doctor is the creator
            if (operationRequest.StaffId.ToString() != requestingDoctorId)
                throw new UnauthorizedAccessException("Only the requesting doctor can delete this operation request.");

            // Check if operation is not scheduled
            if (operationRequest.Status == RequestStatus.Scheduled)
                throw new BusinessRuleValidationException("Cannot delete a scheduled operation request.");

    
            await _planningModuleNotifier.NotifyOperationRequestCancelledAsync(operationRequest);

            // Create deletion log
            var log = new Log(
                TypeOfAction.Delete,
                operationRequest.Id.ToString(),
                $"Operation request deleted by Dr. {requestingDoctorId}"
            );
            await _logRepository.AddAsync(log);

            // Add domain event
            var deletionEvent = new OperationRequestDeletedEvent(
                operationRequest.Id,
                requestingDoctorId,
                DateTime.UtcNow
            );
            operationRequest.AddDomainEvent(deletionEvent);

            await _repository.RemoveAsync(operationRequest);
            await _unitOfWork.CommitAsync();
            
            return true;
        }

        public async Task<List<OperationRequest>> GetOperationRequestsByStaffAsync(string staffId)
        {
            return await _repository.GetByStaffIdAsync(new StaffId(staffId));
        }

        public async Task<List<OperationRequest>> SearchOperationRequestsAsync(OperationRequestSearchParams searchParams)
        {
            var allRequests = await _repository.GetAllAsync();
            
            var filteredRequests = new List<OperationRequest>();
            foreach (var request in allRequests)
            {
                var patient = await _patientRepository.GetByIdAsync(request.PatientId);
                var operationType = await _operationTypeRepository.GetByIdAsync(request.OperationTypeId);
                
                if ((string.IsNullOrEmpty(searchParams.PatientName) || patient?.FullName.Contains(searchParams.PatientName, StringComparison.OrdinalIgnoreCase) == true) &&
                    (string.IsNullOrEmpty(searchParams.OperationType) || operationType?.Name.Contains(searchParams.OperationType, StringComparison.OrdinalIgnoreCase) == true) &&
                    (!searchParams.Priority.HasValue || request.Priority == searchParams.Priority.Value) &&
                    (!searchParams.Status.HasValue || request.Status == searchParams.Status) &&
                    (!searchParams.StartDate.HasValue || request.CreatedAt >= searchParams.StartDate) &&
                    (!searchParams.EndDate.HasValue || request.CreatedAt <= searchParams.EndDate))
                {
                    filteredRequests.Add(request);
                }
            }
            
            return filteredRequests;
        }
    }

    public class OperationRequestResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public OperationRequest? OperationRequest { get; set; }
    }

    public class OperationRequestSearchParams
    {
        public string? PatientName { get; }
        public string? OperationType { get; }
        public PriorityLevel? Priority { get; }
        public RequestStatus? Status { get; }
        public DateTime? StartDate { get; }  // Add this
        public DateTime? EndDate { get; }    // Add this

        public OperationRequestSearchParams(
            string? patientName, 
            string? operationType, 
            PriorityLevel? priority, 
            RequestStatus? status,
            DateTime? startDate = null,  // Add these with default values
            DateTime? endDate = null)
        {
            PatientName = patientName;
            OperationType = operationType;
            Priority = priority;
            Status = status;
            StartDate = startDate;
            EndDate = endDate;
        }
    }
}
