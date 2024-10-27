using System;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequestDTO
    {
        public Guid Id { get; init; }
        public string DeadlineDate { get; init; }
        public string Priority { get; init; }
        public string Status { get; init; }
        public Guid PatientId { get; init; }
        public Guid DoctorId { get; init; }
        public Guid OperationTypeId { get; init; }

        public OperationRequestDTO()
        {
        }

        public OperationRequestDTO(Guid id, string deadlineDate, string priority, string status, Guid patientId, Guid doctorId, Guid operationTypeId)
        {
            Id = id;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
            PatientId = patientId;
            DoctorId = doctorId;
            OperationTypeId = operationTypeId;
        }
    }
}