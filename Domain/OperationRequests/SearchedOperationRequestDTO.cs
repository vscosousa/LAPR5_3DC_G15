using Microsoft.AspNetCore.Components.Server;

namespace DDDSample1.Domain.Patients
{
    public class SearchedOperationRequestDTO
    {
        public string PatientName { get; init; }
        public string OperationType { get; init; }
        public string Status { get; init; }
        public string Priority { get; init; }
        public string DoctorId { get; init; }
        public string DeadlineDate { get; init; }
        
        public SearchedOperationRequestDTO() { }

        public SearchedOperationRequestDTO(string patientName, string operationType, string status, string priority, string doctorId, string deadlineDate){

            PatientName = patientName;
            OperationType = operationType;
            Status = status;
            Priority = priority;
            DoctorId = doctorId;
            DeadlineDate = deadlineDate;
        }
    }
}