using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using System;
using DDDSample1.Domain.Specializations;
using System.Linq;
using DDDSample1.Domain.Staffs;
using DDD.sample1.Domain.Staffs;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationTypeRepository _repository;

        private readonly ISpecializationRepository _specializationRepository;
        private readonly IStaffRepository _staffRepository;

        private readonly IOperationTypeMapper _mapper;

        public OperationTypeService(IUnitOfWork unitOfWork, IOperationTypeRepository repository, ISpecializationRepository specializationRepository, IStaffRepository staffRepository, IOperationTypeMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _specializationRepository = specializationRepository;
            _staffRepository = staffRepository;
            _mapper = mapper;
        }


        //Create OperationType 
        // US 5.1.20
        public async Task<OperationType> CreateOperationTypeAsync(CreatingOperationTypeDTO dto)
        {

            var existingOperation = await _repository.GetByNameAsync(dto.Name);
            if (existingOperation != null)
            {
                throw new InvalidOperationException($"An operation with the name '{dto.Name}' already exists.");
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
                    throw new ArgumentException("Specialization ID cannot be null.");
                }
            }


            var newOperationType = _mapper.ToDomain(dto);


            newOperationType.AddSpecializations(specializations);
            newOperationType.AddStaffs(staffs);


            await _repository.AddAsync(newOperationType);
            await _unitOfWork.CommitAsync();

            return newOperationType;
        }

        //Update OperationType
        // US 5.1.21
        public async Task<OperationType> UpdateOperationTypeAsync(string operationTypeName, UpdatingOperationTypeDTO dto)
        {

            var operationType = await _repository.GetByNameAsync(operationTypeName);

            if (operationType == null)
            {
                throw new KeyNotFoundException($"OperationType with ID {operationTypeName} not found.");
            }

            // Step 2: Update the editable fields if they are provided
            if (!string.IsNullOrEmpty(dto.Name))
            {
                operationType.UpdateName(dto.Name);
            }

            if (!string.IsNullOrEmpty(dto.EstimatedDuration))
            {
                operationType.UpdateEstimatedDuration(dto.EstimatedDuration);
            }

            await _repository.UpdateAsync(operationType);
            await _unitOfWork.CommitAsync();
            return operationType;
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
            await _repository.UpdateAsync(operationType);
            await _unitOfWork.CommitAsync();
        }


        //Get OperationType by Id
        // US 5.1.23
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
                    staffs.Add(new StaffDTO(staff.Id.AsGuid(), staff.FirstName, staff.LastName, staff.FullName, staff.Email, staff.LicenseNumber, staff.PhoneNumber, staff.AvailabilitySlots));
                }
            }

            var operationTypeDTO = new OperationTypeDTO(operationType.Id.AsGuid(), operationType.Name, operationType.EstimatedDuration, staffs);

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
                    staffs.Add(new StaffDTO(staff.Id.AsGuid(), staff.FirstName, staff.LastName, staff.FullName, staff.Email, staff.LicenseNumber, staff.PhoneNumber, staff.AvailabilitySlots));
                }
            }

            var OperationTypeDTO = new OperationTypeDTO(operationType.Id.AsGuid(), operationType.Name, operationType.EstimatedDuration, staffs);

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
                    .Select(staff => new StaffDTO(
                        staff.Id.AsGuid(),
                        staff.FirstName,
                        staff.LastName,
                        staff.FullName,
                        staff.Email,
                        staff.LicenseNumber,
                        staff.PhoneNumber,
                        staff.AvailabilitySlots))
                    .ToList();

                return new OperationTypeDTO(
                    ot.Id.AsGuid(),
                    ot.Name,
                    ot.EstimatedDuration.ToString(),
                    staffs);
            }).ToList();

            return operationTypeDTOs;
        }
    }
}
