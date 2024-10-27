using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequestDTO
    {
        public Guid Id { get; set; }
        public string PatientId { get; set; }
        public string StaffId { get; set; }
        public string OperationTypeId { get; set; }
        public DateTime Deadline { get; set; }
        public PriorityLevel Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public RequestStatus Status { get; set; }
        public Patient PatientName { get; set; }

        public OperationRequestDTO(Guid id, string patientId, string staffId, string operationTypeId, DateTime deadline, PriorityLevel priority, DateTime createdAt, RequestStatus status, Patient patientName)
        {
            Id = id;
            PatientId = patientId;
            StaffId = staffId;
            OperationTypeId = operationTypeId;
            Deadline = deadline;
            Priority = priority;
            CreatedAt = createdAt;
            Status = status;
            PatientName = patientName;
        }
    }
}
