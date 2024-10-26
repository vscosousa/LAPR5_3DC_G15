using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using System.Linq;
using DDDSample1.Domain.Staffs;

using System;
using DDDSample1.Domain.Logs;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationTypeRepository _repository;
        private readonly ISpecializationRepository _specializationRepository;
        private readonly IStaffRepository _staffRepository;

        private readonly ILogRepository _logRepository;
        private readonly IOperationTypeMapper _mapper;
        private readonly IStaffMapper _staffMapper;

        public OperationTypeService(IUnitOfWork unitOfWork, IOperationTypeRepository repository, ISpecializationRepository specializationRepository, IStaffRepository staffRepository, IOperationTypeMapper mapper, ILogRepository logRepository, IStaffMapper staffMapper)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _specializationRepository = specializationRepository;
            _staffRepository = staffRepository;
            _mapper = mapper;
            _logRepository = logRepository;
            _staffMapper = staffMapper;
        }

        //Create OperationType 
        // US 5.1.20
        public async Task<OperationTypeDTO> CreateOperationTypeAsync(CreatingOperationTypeDTO dto)
        {
            var existingOperation = await _repository.GetByNameAsync(dto.Name);
            if (existingOperation != null)
            {
                throw new InvalidOperationException($"An operation with the name '{dto.Name}' already exists.");
            }

            if (dto.Specializations == null || !dto.Specializations.Any())
            {
                throw new InvalidOperationException("At least one specialization ID must be provided.");
            }

            var specializations = new List<Specialization>();
            var staffs = new List<Staff>();

            foreach (var specId in dto.Specializations)
            {
                if (specId != Guid.Empty)
                {
                    var spec = await _specializationRepository.GetByIdAsync(new SpecializationId(specId));
                    if (spec == null)
                        throw new KeyNotFoundException($"Specialization with ID {specId} not found.");

                    specializations.Add(spec);

                    // Retrieve and add the Staffs for this specialization
                    var specStaffs = await _staffRepository.GetStaffBySpecializationIdAsync(new SpecializationId(specId));
                    staffs.AddRange(specStaffs);
                }
                else
                {
                    throw new ArgumentException("Specialization ID cannot be empty.");
                }
            }

            var newOperationType = _mapper.ToDomain(dto);

            newOperationType.AddSpecializations(specializations);
            newOperationType.AddStaffs(staffs);

            await _repository.AddAsync(newOperationType);
            await _unitOfWork.CommitAsync();

            var operationTypeDTO = _mapper.ToDto(newOperationType);
            return operationTypeDTO;
        }

        // Update OperationType - US 5.1.21
        public async Task<OperationTypeDTO> UpdateOperationTypeAsync(string operationTypeName, UpdatingOperationTypeDTO dto)
        {
            var operationType = await _repository.GetByNameAsync(operationTypeName);

            if (operationType == null)
            {
                throw new KeyNotFoundException($"OperationType with name {operationTypeName} not found.");
            }

            var updatedFields = new List<string>();


            var updateActions = new Dictionary<string, Func<Task>>
            {
                { "Name", async () => {
                    if (!string.IsNullOrEmpty(dto.Name) && operationType.Name != dto.Name) {
                        operationType.UpdateName(dto.Name);
                        updatedFields.Add("Name");
                    }
                    await Task.CompletedTask;
                }},
                { "Estimated Duration", async () => {
                    if (!string.IsNullOrEmpty(dto.EstimatedDuration) && operationType.EstimatedDuration != dto.EstimatedDuration) {
                        operationType.UpdateEstimatedDuration(dto.EstimatedDuration);
                        updatedFields.Add("Estimated Duration");
                    }
                    await Task.CompletedTask;
                }},
                { "Specializations", async () => {
                    if (dto.Specializations != null && dto.Specializations.Count > 0)
                    {
                        var specializations = new List<Specialization>();
                        foreach (var specId in dto.Specializations)
                        {
                            var spec = await _specializationRepository.GetByIdAsync(new SpecializationId(specId));
                            if (spec == null)
                            {
                                throw new KeyNotFoundException($"Specialization with ID {specId} not found.");
                            }
                            specializations.Add(spec);
                        }
                        operationType.UpdateSpecializations(specializations);
                        updatedFields.Add("Specializations");
                    }
                }}
            };


            foreach (var action in updateActions.Values)
            {
                await action();
            }

            if (updatedFields.Count > 0)
            {
                string message = "OperationType updated. The following fields were updated: " + string.Join(", ", updatedFields) + ".";
                var log = new Log(TypeOfAction.Update, operationType.Id.ToString(), message);
                await _logRepository.AddAsync(log);
            }

            await _repository.UpdateAsync(operationType);
            await _unitOfWork.CommitAsync();

            var operationTypeDTO = _mapper.ToDto(operationType);
            return operationTypeDTO;
        }


        //Deactivate OperationType
        // US 5.1.22
        public async Task DeactivateOperationTypeAsync(string operationName)
        {
            var operationType = await _repository.GetByNameAsync(operationName);
            if (operationType == null)
            {
                throw new KeyNotFoundException($"OperationType with name {operationName} not found.");
            }

            operationType.Deactivate();
            var log = new Log(TypeOfAction.Delete, operationType.Id.ToString(), $"OperationType '{operationName}' deactivated.");
            await _logRepository.AddAsync(log);

            await _repository.UpdateAsync(operationType);
            await _unitOfWork.CommitAsync();
        }

        //Activate OperationType
        //US 5.1.22

        public async Task ActivateOperationTypeAsync(string operationName)
        {
            var operationType = await _repository.GetByNameAsync(operationName);
            if (operationType == null)
            {
                throw new KeyNotFoundException($"OperationType with name {operationName} not found.");
            }

            operationType.Activate();
            var log = new Log(TypeOfAction.Update, operationType.Id.ToString(), $"OperationType '{operationName}' activated.");
            await _logRepository.AddAsync(log);
            await _repository.UpdateAsync(operationType);
            await _unitOfWork.CommitAsync();
        }


               public async Task<OperationTypeDTO> GetOperationTypeWithStaffsAsync(OperationTypeId operationTypeId)
        {
            var operationType = await _repository.GetOpStaffByIdAsync(operationTypeId, true);
            if (operationType == null)
            {
                throw new KeyNotFoundException($"OperationType with ID {operationTypeId} not found.");
            }
        
            List<StaffDTO> staffs = new List<StaffDTO>();
        
            foreach (var spec in operationType.Specializations)
            {
                foreach (var staff in spec.Staffs)
                {
                    staffs.Add(_staffMapper.ToDto(staff));
                }
            }
            var specializationIds = operationType.Specializations.Select(spec => spec.Id.AsGuid()).ToList();
            var operationTypeDTO = _mapper.ToDto(operationType);
        
            return operationTypeDTO;
        }

        //Get OperationType by status
        // US 5.1.23
        public async Task<List<OperationType>> GetOperationTypesByStatusAsync(bool status)
        {

            var operationType = await _repository.GetOpByStatusAsync(status);

            if (operationType == null)
            {
                throw new KeyNotFoundException($"OperationType with status {status} not found.");
            }

            return operationType;
        }

        //Get OperationType by name
        //US 5.1.23

        public async Task<OperationTypeDTO> GetOperationTypesByNameAsync(string name)
        {

            var operationType = await _repository.GetByNameAsync(name);

            if (operationType == null)
            {
                throw new KeyNotFoundException($"OperationType with Name {name} not found.");
            }

            List<StaffDTO> staffs = new List<StaffDTO>();

            foreach (var spec in operationType.Specializations)
            {
                foreach (var staff in spec.Staffs)
                {
                    staffs.Add(_staffMapper.ToDto(staff));
                }
            }

            var specializationIds = operationType.Specializations.Select(spec => spec.Id.AsGuid()).ToList();
            var OperationTypeDTO = new OperationTypeDTO(operationType.Id.AsGuid(), operationType.Name, operationType.EstimatedDuration, specializationIds, staffs);

            return OperationTypeDTO;
        }

        //List All OperationsType

        public async Task<IEnumerable<OperationTypeDTO>> GetAllOperationsTypeAsync()
        {

            var operationTypes = await _repository.GetAllOpAsync();

            var operationTypeDTOs = operationTypes.Select(ot =>
            {
                var staffs = ot.Specializations
                    .SelectMany(spec => spec.Staffs)
                    .Select(staff => _staffMapper.ToDto(staff))
                    .ToList();

                return new OperationTypeDTO(
                    ot.Id.AsGuid(),
                    ot.Name,
                    ot.EstimatedDuration.ToString(),
                    ot.Specializations.Select(spec => spec.Id.AsGuid()).ToList(),
                    staffs);
            }).ToList();

            return operationTypeDTOs;
        }
    }
}
