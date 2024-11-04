using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypes
{
    public interface IOperationTypeRepository : IRepository<OperationType, OperationTypeId>
    {
        Task<IEnumerable<OperationType>> GetAllOpAsync();
        Task<OperationType> GetByNameAsync(string name);
        Task<List<OperationType>> GetOpByStatusAsync(bool status);
        Task<OperationType> GetOpStaffByIdAsync(OperationTypeId operationTypeId, bool includeStaff);


    }
}