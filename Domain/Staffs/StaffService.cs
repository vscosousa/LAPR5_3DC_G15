using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Infrastructure.Specializations;
using System.Linq;

namespace DDDSample1.Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _repository;
        private readonly IStaffMapper _mapper;
        private readonly ISpecializationRepository _specializationRepository;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repository, ISpecializationRepository specializationRepository, IStaffMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _specializationRepository = specializationRepository;
            _mapper = mapper;
        }
        
        // Método para listar todos os staffs
        public async Task<List<StaffDTO>> GetAllStaffsAsync()
        {
            var listStaff = await _repository.GetAllAsync();

            if (listStaff == null)
            {
                throw new KeyNotFoundException($"Staffs not found.");
            }
            
            var listDto = listStaff.ConvertAll(_mapper.ToDto);

            return listDto;
        }

        // Método para listar um staff por ID
        public async Task<StaffDTO> GetStaffByIdAsync(Guid id)
        {
            var staff = await _repository.GetByIdAsync(new StaffId(id));

            if (staff == null)
            {
                throw new KeyNotFoundException($"Staff with ID {id} not found.");
            }

            return _mapper.ToDto(staff);
        }

        public async Task<StaffDTO> CreateStaffAsync(CreatingStaffDTO dto)
        {
           
            string uniqueLicenseNumber = await GenerateUniqueLicenseNumberAsync();

            var staff = _mapper.ToDomain(new CreatingStaffDTO(
                dto.FirstName,
                dto.LastName,
                dto.FullName,
                dto.Email,
                dto.PhoneNumber,
                dto.SpecializationId
            ) {
                LicenseNumber = uniqueLicenseNumber
            });

            // Verificar unicidade do email e telefone
            if (await _repository.GetByEmailAsync(staff.Email) != null)
                throw new InvalidOperationException("Email is already in use.");
            
            if (await _repository.GetByPhoneNumberAsync(staff.PhoneNumber) != null)
                throw new InvalidOperationException("Phone number is already in use.");

            // Salvar o staff no repositório
            await _repository.AddAsync(staff);
            await _unitOfWork.CommitAsync();

            // Retornar o DTO de Staff
            return _mapper.ToDto(staff);
        }

        // Método para gerar um número de licença único
        private async Task<string> GenerateUniqueLicenseNumberAsync()
        {
            string licenseNumber;
            bool isUnique;

            do
            {
                // Gerar um novo número de licença
                licenseNumber = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();

                // Verifica se já existe um funcionário com esse número de licença
                var existingStaff = await _repository.GetByLicenseNumberAsync(licenseNumber);
                isUnique = (existingStaff == null);
            }
            while (!isUnique);

            return licenseNumber;
        }

    }
}