using System;
using System.ComponentModel.DataAnnotations;

namespace DDDSample1.Domain.OperationRequests
{
    public class CreatingOperationRequestDTO
    {
        [Required]
        public string PatientId { get; set; }

        [Required]
        public string StaffId { get; set; }

        [Required]
        public string OperationTypeId { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        [Required]
        public PriorityLevel Priority { get; set; }

        [Required]
        public RequestStatus Status { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        public CreatingOperationRequestDTO() { 
            CreatedAt = DateTime.UtcNow;
            Status = RequestStatus.Pending;
        }

        public CreatingOperationRequestDTO(string operationTypeId)
        {
            OperationTypeId = operationTypeId;
        }
    }
        
    public enum PriorityLevel
    {
        Low,
        Medium,
        High
    }
}
