using System.Threading.Tasks;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Domain.Shared
{
    /// <summary>
    /// Interface for notifying the planning module of operation request changes
    /// </summary>
    public interface IPlanningModuleNotifier
    {
        /// <summary>
        /// Notifies the planning module that an operation request has been updated
        /// </summary>
        Task NotifyOperationRequestUpdateAsync(OperationRequest request);

        /// <summary>
        /// Notifies the planning module that a new operation request has been created
        /// </summary>
        Task NotifyOperationRequestCreatedAsync(OperationRequest request);

        /// <summary>
        /// Notifies the planning module that an operation request has been cancelled
        /// </summary>
        Task NotifyOperationRequestCancelledAsync(OperationRequest request);

        /// <summary>
        /// Notifies the planning module that an operation request has been deleted
        /// </summary>
        Task NotifyOperationRequestDeleted(string operationRequestId);
    }
}
