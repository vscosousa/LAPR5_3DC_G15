using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using System;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationTypeRepository _repository;

        public OperationTypeService(IUnitOfWork unitOfWork, IOperationTypeRepository repository)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
        }

        //Get all OperationTypes
        public async Task<List<OperationType>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        //Get OperationType by ID
        public async Task<OperationType> GetByIdAsync(OperationTypeId id)
        {
            return await this._repository.GetByIdAsync(id);
        }

        //Create OperationType
        public async Task<OperationType> CreateOperationType(CreatingOperationTypeDTO dto)
        {
            try
            {
                var operationType = new OperationType(dto.Name, dto.EstimatedDuration);
                await _repository.AddAsync(operationType);
                await _unitOfWork.CommitAsync();
                return operationType;
            }
            catch (Exception e)
            {
                throw new BusinessRuleValidationException(e.Message);
            }
        }
    }
}