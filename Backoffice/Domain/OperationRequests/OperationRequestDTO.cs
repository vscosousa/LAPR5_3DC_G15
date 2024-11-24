using System;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequestDTO
    {
        public Guid Id { get; init; }
        public string DeadlineDate { get; init; }
        public string Priority { get; init; }
        public string Status { get; init; }
         public string PatientMedicalRecordNumber { get; init; }
        public string DoctorLicenseNumber { get; init; }
        public string OperationType { get; init; }

        public OperationRequestDTO()
        {
        }

        public OperationRequestDTO(Guid id, string deadlineDate, string priority, string status, string patientMedicalRecordNumber, string doctorLicenseNumber, string operationType)
        {
            Id = id;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
            PatientMedicalRecordNumber = patientMedicalRecordNumber;
            DoctorLicenseNumber = doctorLicenseNumber;
            OperationType = operationType;
        }
    }
}