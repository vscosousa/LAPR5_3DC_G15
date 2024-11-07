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
        public async Task<SpecializationDTO> CreateSpecializationAsync(CreatingSpecializationDTO dto)
        {
            try
            {
                var newSpecialization = new Specialization(dto.SpecOption);

                if (await _repository.GetSpecIdByOptionAsync(dto.SpecOption) != null)
                {
                    throw new BusinessRuleValidationException("Specialization already exists.");
                }
                
                await _repository.AddAsync(newSpecialization);
                await _unitOfWork.CommitAsync();

                var staffs = new List<Staff>();

               var newSpecializationDTO = new SpecializationDTO
               {
                   Id = newSpecialization.Id.AsGuid(),
                   SpecOption = newSpecialization.SpecOption,
                   Staff = staffs
               };
               return newSpecializationDTO;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
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
        
        // Get All Specializations
        public async Task<IEnumerable<Specialization>> GetAllSpecializationsAsync()
        {
            var specializations = await _repository.GetAllAsync();
            return specializations;
        }

    }
}