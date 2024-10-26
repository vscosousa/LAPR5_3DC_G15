using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Logs;
using DDDSample1.Infrastructure.Specializations;
using System.Linq;
using System.Diagnostics;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace DDDSample1.Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _repository;
        private readonly IStaffMapper _mapper;
        private readonly ISpecializationRepository _specializationRepository;
        private readonly ILogRepository _logRepository;
        private readonly IMailService _mailService;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repository, IStaffMapper mapper, ISpecializationRepository specializationRepository, ILogRepository logRepository, IMailService mailService)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _mapper = mapper;
            _specializationRepository = specializationRepository;
            _logRepository = logRepository;
            _mailService = mailService;
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
            try
            {   
                if (!string.IsNullOrEmpty(dto.SpecializationName)){
                    var specialization = _specializationRepository.GetSpecIdByOptionAsync(dto.SpecializationName).Result;
                    if (specialization == null)
                    {
                        throw new BusinessRuleValidationException($"Specialization with name {dto.SpecializationName} not found.");
                    }
                    dto.SetSpecializationId(specialization.Id.AsGuid());
                }
                var staff = _mapper.ToDomain(dto);
                // Verificar unicidade do email e telefone
                if (await _repository.GetByEmailAsync(staff.Email) != null)
                    throw new BusinessRuleValidationException("Email is already in use.");

                if (await _repository.GetByPhoneNumberAsync(staff.PhoneNumber) != null)
                    throw new BusinessRuleValidationException("Phone number is already in use.");

                var list = await _repository.GetAllAsync();
                staff.SetLicenseNumber(LicenseNumberGenerator.GenerateLicenseNumber(list.Count));
                
                await _repository.AddAsync(staff);
                await _unitOfWork.CommitAsync();
                Console.WriteLine("Transaction committed successfully");

                var staffDTO = _mapper.ToDto(staff);
                return staffDTO;
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
        
        public async Task<StaffDTO> UpdateStaffAsync(Guid id, UpdateStaffDTO dto)
        {
            var staff = await _repository.GetByIdAsync(new StaffId(id));

            if (staff == null)
                return null;

            var updatedFields = new List<string>();

            // Update Phone Number
            if (!string.IsNullOrEmpty(dto.PhoneNumber) && staff.PhoneNumber != dto.PhoneNumber)
            {
                if (await _repository.GetByPhoneNumberAsync(dto.PhoneNumber) != null)
                    throw new BusinessRuleValidationException("Phone number is already in use.");

                // Send confirmation email
                //await _mailService.SendEmailToStaff(staff.Email, staff.FullName);
                staff.ChangePhoneNumber(dto.PhoneNumber);
                updatedFields.Add("Phone Number");
            }

            // Add Availability Slots
            if (!string.IsNullOrEmpty(dto.AddAvailabilitySlots))
            {
                var addSlots = dto.AddAvailabilitySlots.Split(',')
                                .Select(slot => DateTime.Parse(slot.Trim()))
                                .ToArray();
                foreach (var slot in addSlots)
                {
                    staff.AddAvailabilitySlot(slot);
                }
                updatedFields.Add("Added Availability Slots");
            }

            // Remove Availability Slots
            if (!string.IsNullOrEmpty(dto.RemoveAvailabilitySlots))
            {
                var removeSlots = dto.RemoveAvailabilitySlots.Split(',')
                                    .Select(slot => DateTime.Parse(slot.Trim()))
                                    .ToArray();
                foreach (var slot in removeSlots)
                {
                    staff.RemoveAvailabilitySlot(slot);
                }
                updatedFields.Add("Removed Availability Slots");
            }

            // Update Specialization
            if (!string.IsNullOrEmpty(dto.SpecializationName))
            {   
                var specialization = _specializationRepository.GetSpecIdByOptionAsync(dto.SpecializationName).Result;
                if (specialization == null)
                {
                    throw new BusinessRuleValidationException($"Specialization with name {dto.SpecializationName} not found.");
                }
                if (staff.SpecializationId.ToString() != dto.SpecializationId.ToString()){
                    
                    dto.SetSpecializationId(specialization.Id.AsGuid());

                    staff.ChangeSpecializationId(specialization.Id);
                    updatedFields.Add("Specialization");
                }
            }

            if (updatedFields.Count > 0)
            {
                var logMessage = $"Staff updated. The following fields were updated:"+ string.Join(", ", updatedFields) +".";
                var log = new Log(TypeOfAction.Update, id.ToString(), logMessage);
                await _logRepository.AddAsync(log);

                await _unitOfWork.CommitAsync();
            }

            return _mapper.ToDto(staff);
        }

        public async Task<StaffDTO> DeactivateStaffAsync(Guid id)
        {
            try
            {
                var staff = await _repository.GetByIdAsync(new StaffId(id));

                if (staff == null)
                    throw new BusinessRuleValidationException("Staff not found.");

                staff.Deactivate();

                var logMessage = $"Staff profile {staff.FullName} (ID: {staff.Id}) has been deactivated.";
                var log = new Log(TypeOfAction.Deactivate, id.ToString(), logMessage);
                await _logRepository.AddAsync(log);

                await _unitOfWork.CommitAsync();
                return _mapper.ToDto(staff);    
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

        public async Task<List<StaffDTO>> SearchStaffProfiles(SearchStaffDTO dto)
        {   
            if (!string.IsNullOrEmpty(dto.SpecializationName)){
                var specialization = _specializationRepository.GetSpecIdByOptionAsync(dto.SpecializationName).Result;
                if (specialization == null)
                {
                    throw new BusinessRuleValidationException($"Specialization with name {dto.SpecializationName} not found.");
                }
                dto.SetSpecializationId(specialization.Id.AsGuid());
            }
            
            var staffProfiles = await _repository.SearchStaffAsync(dto);

            if (staffProfiles == null || staffProfiles.Count == 0)
            {
                return null;
            }

            return staffProfiles.ConvertAll(_mapper.ToDto);
        }

    }
}