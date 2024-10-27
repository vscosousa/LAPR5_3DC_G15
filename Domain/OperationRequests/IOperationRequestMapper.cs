using System;
using System.Collections.Generic;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationRequests
{
    public interface IOperationRequestMapper
    {
        OperationRequestDTO ToDTO(OperationRequest entity);
        OperationRequest ToEntity(CreatingOperationRequestDTO dto);
        void UpdateEntity(OperationRequest entity, CreatingOperationRequestDTO dto);
    }
}
