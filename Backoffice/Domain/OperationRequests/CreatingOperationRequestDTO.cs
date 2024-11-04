using System;

namespace DDDSample1.Domain.OperationRequests
{
    public class CreatingOperationRequestDTO
    {
        public Guid PatientId { get; init; }
        public Guid DoctorId { get; init; }
        public Guid OperationTypeId { get; init; }
        public string DeadlineDate { get; init; }
        public string Priority { get; init; }
        public CreatingOperationRequestDTO() { }

        public CreatingOperationRequestDTO(string deadlineDate, string priority, Guid patientId, Guid doctorId, Guid operationTypeId)
        {
            DeadlineDate = deadlineDate;
            Priority = priority;
            PatientId = patientId;
            DoctorId = doctorId;
            OperationTypeId = operationTypeId;
        }
    }
}