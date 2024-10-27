using System;
using DDDSample1.Domain.OperationRequests;

public class OperationRequestWithDetails
{
    public Guid Id { get; set; }
    public string PatientId { get; set; }
    public string PatientName { get; set; }
    public string OperationTypeId { get; set; }
    public string OperationTypeName { get; set; }
    public string CreatedByStaffId { get; set; }
    public DateTime CreatedAt { get; set; }
    public PriorityLevel Priority { get; set; }
    public DateTime? Deadline { get; set; }
    public RequestStatus Status { get; set; }
}

