using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;
using System.Linq;

namespace DDDSample1.Domain.Specializations
{
    public class SpecializationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISpecializationRepository _repository;

        public SpecializationService(IUnitOfWork unitOfWork, ISpecializationRepository repository)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
        }

        //Create Specializations
        public async Task<Specialization> CreateSpecializationAsync(CreatingSpecializationDTO dto)
        {
            var newSpecialization = new Specialization(dto.SpecOption);
             
            await _repository.AddAsync(newSpecialization);
            await _unitOfWork.CommitAsync();

            return newSpecialization;
        }

        // Get Specialization by Id
        public async Task<Specialization> GetSpecializationByIdAsync(SpecializationId id)
        {
            
            var specialization = await _repository.GetByIdSpecAsync(id, includeStaff: true); 

            if (specialization == null)
            {
                throw new KeyNotFoundException($"Specialization with ID {id} not found.");
            }

            return specialization;
        }

    }
}