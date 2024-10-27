using System;

namespace DDDSample1.Domain.OperationRequests
{
    public class SearchOperationRequestDTO
    {
        public string? PatientName { get; set; }
        public string? OperationType { get; set; }
        public string? PriorityLevel { get; set; }
        public string? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
