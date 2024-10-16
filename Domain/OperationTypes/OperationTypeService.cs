using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using System;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationTypeRepository _repository;

        private readonly SpecializationService _specializationService;

        public OperationTypeService(IUnitOfWork unitOfWork, IOperationTypeRepository repository, SpecializationService specializationService)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _specializationService = specializationService;
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

       /* public async Task<OperationType> CreateOperationType(CreatingOperationTypeDTO dto)
        {
            try
            {
                var specializations = new List<Specialization>();

            

                // Create the OperationType entity with the validated inputs
                var operationType = new OperationType(dto.Name, dto.EstimatedDuration, specializations);

                await _repository.AddAsync(operationType);
                await _unitOfWork.CommitAsync();

                return operationType;
            }
            catch (Exception e)
            {
                throw new BusinessRuleValidationException(e.Message);
            }
        }*/

    }
}