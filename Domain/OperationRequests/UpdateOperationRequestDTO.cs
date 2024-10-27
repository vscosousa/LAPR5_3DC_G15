using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;  
namespace DDDSample1.Domain.OperationRequests
{
    public class UpdateOperationRequestDTO
{
    public string Id { get; set; }
    public string PatientId { get; set; }
    public string StaffId { get; set; }
    public string OperationTypeId { get; set; }
     public DateTime? Deadline { get; set; }
    public PriorityLevel Priority { get; set; }
    public RequestStatus Status { get; set; }

}
}
