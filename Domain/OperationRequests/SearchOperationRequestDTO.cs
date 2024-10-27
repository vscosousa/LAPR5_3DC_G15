namespace DDDSample1.Domain.Patients
{
    public class SearchOperationRequestDTO
    {
        public string PatientName { get; init; }
        public string OperationType { get; init; }
        public string Status { get; init; }
        public string Priority { get; init; }
        
        public SearchOperationRequestDTO() { }

        public SearchOperationRequestDTO(string patientName, string operationType, string status, string priority)
        {
            PatientName = patientName;
            OperationType = operationType;
            Status = status;
            Priority = priority;
        }
    }
}