using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {
        private DateOnly _deadlineDate;
        private Priority _priority;
        private OperationRequestStatus _status;
        private PatientId _patientId;
        private StaffId _doctorId;
        private OperationTypeId _operationTypeId;

        [JsonIgnore]
        private Patient _patient;

        [JsonIgnore]
        private Staff _doctor;

        [JsonIgnore]
        private OperationType _operationType;
        
        // Parameterless constructor for EF Core
        private OperationRequest() { }

        public OperationRequest(DateOnly deadlineDate, Priority priority, PatientId patientId, StaffId doctorId, OperationTypeId operationTypeId)
        {
            if (deadlineDate < DateOnly.FromDateTime(DateTime.Now))
                throw new BusinessRuleValidationException("Deadline date must be in the future.");

            Id = new OperationRequestId(Guid.NewGuid());
            _deadlineDate = deadlineDate;
            _priority = priority;
            _status = OperationRequestStatus.Pending;
            _patientId = patientId;
            _doctorId = doctorId;
            _operationTypeId = operationTypeId;
        }

        public DateOnly DeadlineDate => _deadlineDate;
        public Priority Priority => _priority;
        public OperationRequestStatus Status => _status;
        public PatientId PatientId => _patientId;
        public StaffId DoctorId => _doctorId;
        public OperationTypeId OperationTypeId => _operationTypeId; 
        public Patient Patient => _patient;
        public Staff Doctor => _doctor;
        public OperationType OperationType => _operationType;

        internal void ChangeDeadline(string deadlineDate)
        {
            DateOnly deadline = DateOnly.Parse(deadlineDate);
            if (deadline < DateOnly.FromDateTime(DateTime.Now))
                throw new BusinessRuleValidationException("Deadline date must be in the future.");

            _deadlineDate = deadline;
        }

        internal void ChangePriority(string priority)
        {
            _priority = Enum.Parse<Priority>(priority);
        }
    }
}