using System;

namespace DDDSample1.Domain.OperationRequests
{
    public class UpdatingOperationRequestDTO
    {
        public string DeadlineDate { get; init; }
        public string Priority { get; init; }
        public UpdatingOperationRequestDTO() { }

        public UpdatingOperationRequestDTO(string deadlineDate, string priority)
        {
            DeadlineDate = deadlineDate;
            Priority = priority;
        }
    }
}