using System;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Domain.Events
{
    public interface IDomainEvent
    {
       
    }

    public class OperationRequestDeletedEvent : IDomainEvent
    {
        public string OperationRequestId { get; }
        public string DeletedByStaffId { get; }
        public DateTime DeletedAt { get; }

        public OperationRequestDeletedEvent(OperationRequestId operationRequestId, string deletedByStaffId, DateTime deletedAt)
        {
            OperationRequestId = operationRequestId.ToString(); // Convert to string since property is string
            DeletedByStaffId = deletedByStaffId;
            DeletedAt = deletedAt;
        }
    }
}
