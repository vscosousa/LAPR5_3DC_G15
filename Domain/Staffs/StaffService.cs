using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Logs;
using DDDSample1.Infrastructure.Specializations;
using System.Linq;
using System.Diagnostics;

namespace DDDSample1.Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _repository;
        private readonly IStaffMapper _mapper;
        private readonly ISpecializationRepository _specializationRepository;
        private readonly ILogRepository _logRepository;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repository, ISpecializationRepository specializationRepository, IStaffMapper mapper, ILogRepository logRepository)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _specializationRepository = specializationRepository;
            _logRepository = logRepository;
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
                licenseNumber = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();        
                var existingStaff = await _repository.GetByLicenseNumberAsync(licenseNumber);
                isUnique = (existingStaff == null);
            }
            while (!isUnique);

            return licenseNumber;
        }
        
        public async Task<StaffDTO> UpdateStaffAsync(Guid id, UpdateStaffDTO dto)
        {
            var staff = await _repository.GetByIdAsync(new StaffId(id));

            if (staff == null)
                return null;

            var updatedFields = new List<string>();

            var updateActions = new Dictionary<string, Action>
            {
                { "First Name", () => { if (!string.IsNullOrEmpty(dto.FirstName) && staff.FirstName != dto.FirstName) { staff.ChangeFirstName(dto.FirstName); updatedFields.Add("First Name"); } } },
                { "Last Name", () => { if (!string.IsNullOrEmpty(dto.LastName) && staff.LastName != dto.LastName) { staff.ChangeLastName(dto.LastName); updatedFields.Add("Last Name"); } } },
                { "Full Name", () => { if (!string.IsNullOrEmpty(dto.FullName) && staff.FullName != dto.FullName) { staff.ChangeFullName(dto.FullName); updatedFields.Add("Full Name"); } } },
                { "Email", () => { if (!string.IsNullOrEmpty(dto.Email) && staff.Email != dto.Email) { staff.ChangeEmail(dto.Email); updatedFields.Add("Email"); } } },
                { "Phone Number", () => { if (!string.IsNullOrEmpty(dto.PhoneNumber) && staff.PhoneNumber != dto.PhoneNumber) { staff.ChangePhoneNumber(dto.PhoneNumber); updatedFields.Add("Phone Number"); } } },
                { "Add Availability Slots", () => 
                    { 
                        if (!string.IsNullOrEmpty(dto.AddAvailabilitySlots))
                        {
                            var addSlots = dto.AddAvailabilitySlots.Split(',').Select(DateTime.Parse).ToArray();
                            foreach (var slot in addSlots)
                            {
                                staff.AddAvailabilitySlots(slot);
                            }
                            updatedFields.Add("Added Availability Slots");
                        }
                    }
                },
                { "Remove Availability Slots", () => 
                    { 
                        if (!string.IsNullOrEmpty(dto.RemoveAvailabilitySlots))
                        {
                            var removeSlots = dto.RemoveAvailabilitySlots.Split(',').Select(DateTime.Parse).ToArray();
                            foreach (var slot in removeSlots)
                            {
                                staff.RemvoveAvailabilitySlots(slot);
                            }
                            updatedFields.Add("Removed Availability Slots");
                        }
                    }
                },
                { "Specialization", () => 
                    { 
                        if (!string.IsNullOrEmpty(dto.SpecializationId) && staff.SpecializationId.ToString() != dto.SpecializationId)
                        {
                            staff.ChangeSpecializationId(new SpecializationId(Guid.Parse(dto.SpecializationId)));
                            updatedFields.Add("Specialization Id");
                        }
                    }
                }
            };

            foreach (var action in updateActions.Values)
            {
                action();
            }

            if (updatedFields.Count > 0)
            {
                string message = "Staff updated. The following fields were updated: " + string.Join(", ", updatedFields) + ".";
                var log = new Log(TypeOfAction.Update, id.ToString(), message);
                await _logRepository.AddAsync(log);
                await _unitOfWork.CommitAsync();
            }

            return _mapper.ToDto(staff);
        }


    }
}