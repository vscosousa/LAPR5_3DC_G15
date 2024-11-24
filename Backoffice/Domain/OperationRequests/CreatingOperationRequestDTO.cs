using System;

namespace DDDSample1.Domain.OperationRequests
{
    public class CreatingOperationRequestDTO
    {
        public string PatientMedicalRecordNumber { get; init; }
        public string DoctorLicenseNumber { get; init; }
        public string OperationType { get; init; }
        public string DeadlineDate { get; init; }
        public string Priority { get; init; }
        public CreatingOperationRequestDTO() { }

        public CreatingOperationRequestDTO(string deadlineDate, string priority, string patientMedicalRecordNumber, string doctorLicenseNumber, string operationType)
        {
            DeadlineDate = deadlineDate;
            Priority = priority;
            PatientMedicalRecordNumber = patientMedicalRecordNumber;
            DoctorLicenseNumber = doctorLicenseNumber;
            OperationType = operationType;
        }
    }
}