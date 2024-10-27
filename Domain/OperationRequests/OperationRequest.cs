using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.OperationTypes;
using System.ComponentModel.DataAnnotations;
using System.Buffers;
using DDDSample1.Domain.Events;
using System.Linq;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {
        private readonly List<IDomainEvent> _domainEvents = new List<IDomainEvent>();

        public PatientId PatientId { get; private set; }
        public StaffId StaffId { get; private set; }
        public OperationTypeId OperationTypeId { get; private set; }
        public DateTime Deadline { get; private set; }
        public PriorityLevel Priority { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public RequestStatus Status { get; private set; }
        public bool IsDeleted { get; private set; }
        public DateTime? DeletedAt { get; private set; }
        public string DeletedBy { get; private set; }
        public StaffId CreatedByStaffId { get; private set; }
        public virtual Patient Patient { get; private set; }
        private OperationRequest() { }

       public OperationRequest(OperationRequestId id, PatientId patientId, StaffId staffId, 
    OperationTypeId operationTypeId, DateTime deadline, RequestStatus status, PriorityLevel priority, DateTime createdAt, Patient patient)
{
            Id = id;
            PatientId = patientId;
            StaffId = staffId;
            OperationTypeId = operationTypeId;
            Deadline = deadline;
            Priority = priority;
            CreatedAt = DateTime.UtcNow;
            Status = RequestStatus.Pending;
            CreatedByStaffId = staffId;
            Patient = patient;
            ValidateRequest();
        }

        public OperationRequest(string operationTypeId)
        {
            this.OperationTypeId = new OperationTypeId(operationTypeId);
        }

        private void ValidateRequest()
        {
            if (PatientId == null)
                throw new BusinessRuleValidationException("Patient ID cannot be null");
            
            if (StaffId == null)
                throw new BusinessRuleValidationException("Staff ID cannot be null");
            
            if (OperationTypeId == null)
                throw new BusinessRuleValidationException("Operation Type ID cannot be null");
            
            if (Deadline < DateTime.UtcNow)
                throw new BusinessRuleValidationException("Deadline cannot be in the past");
            
            if (!Enum.IsDefined(typeof(PriorityLevel), Priority))
                throw new BusinessRuleValidationException("Invalid priority level");
        }

        public void UpdateStatus(RequestStatus newStatus)
        {
            Status = newStatus;
        }

        public void UpdateDetails(PatientId patientId, StaffId staffId, OperationTypeId operationTypeId, DateTime deadline, PriorityLevel priority)
        {
            PatientId = patientId;
            StaffId = staffId;
            OperationTypeId = operationTypeId;
            Deadline = deadline;
            Priority = priority;
        }
        public void MarkAsDeleted(string staffId)
{
    if (string.IsNullOrEmpty(staffId))
        throw new ArgumentNullException(nameof(staffId));

    if (Status == RequestStatus.Scheduled)
        throw new BusinessRuleValidationException("Cannot delete a scheduled operation request.");

    if (CreatedByStaffId.Value != staffId)
        throw new UnauthorizedAccessException("Only the creating doctor can delete this request.");

    // Add validation to ensure it's not already deleted
    if (IsDeleted)
        throw new BusinessRuleValidationException("Operation request is already deleted.");

    IsDeleted = true;
    DeletedAt = DateTime.UtcNow;
    DeletedBy = staffId;
    Status = RequestStatus.Cancelled;  // Add this line to ensure consistency

    AddDomainEvent(new OperationRequestDeletedEvent(Id, staffId, DeletedAt.Value));
}
        public void AddDomainEvent(IDomainEvent domainEvent)
        {
            _domainEvents.Add(domainEvent);
        }

        public List<IDomainEvent> GetDomainEvents() => _domainEvents?.ToList();

        public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

        public void ClearDomainEvents()
        {
            _domainEvents.Clear();
        }
    }

    public enum RequestStatus
    {
        Pending,
        Approved,
        Scheduled,
        Completed,
        Cancelled
    }
}
