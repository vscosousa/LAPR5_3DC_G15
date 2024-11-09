using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Logs;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Staffs;
using Moq;
using Xunit;

namespace DDDSample1.Tests.OperationTypes.UnitTests
{
    public class OperationTypesServiceTest
    {

        /**private readonly IUnitOfWork _unitOfWork;
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
*/
        //Create mocks
        private readonly Mock<IUnitOfWork> _unitOfWork;
        private readonly Mock<IOperationTypeRepository> _repository;
        private readonly Mock<ISpecializationRepository> _specializationRepository;
        private readonly Mock<IStaffRepository> _staffRepository;
        private readonly Mock<IOperationTypeMapper> _mapper;
        private readonly Mock<ILogRepository> _logRepository;
        private readonly Mock<IStaffMapper> _staffMapper;
        private readonly OperationTypeService _operationTypeService;

        public OperationTypesServiceTest()
        {
            _unitOfWork = new Mock<IUnitOfWork>();
            _repository = new Mock<IOperationTypeRepository>();
            _specializationRepository = new Mock<ISpecializationRepository>();
            _staffRepository = new Mock<IStaffRepository>();
            _mapper = new Mock<IOperationTypeMapper>();
            _logRepository = new Mock<ILogRepository>();
            _staffMapper = new Mock<IStaffMapper>();
            _operationTypeService = new OperationTypeService(_unitOfWork.Object, _repository.Object,
             _specializationRepository.Object, _staffRepository.Object, _mapper.Object,
              _logRepository.Object, _staffMapper.Object);
        }

            [Fact]
            public async Task CreateOperationTypeAsync_ValidInput()
            {
                // Arrange
                var dto = new CreatingOperationTypeDTO
                {
                    Name = "Cardiology Operation",
                    EstimatedDuration = "2 hours",
                    Specializations = new List<string> { "Cardiology" }
                };
            
                var specialization = new Specialization("Cardiology");
                var staff = new Staff("Joao", "Pereira", "Joao Pereira", "joao@gmail.com", "+351965265129", StaffType.Admin, specialization.Id);
                var staffDto = new StaffDTO(staff.Id.AsGuid(), staff.FirstName, staff.LastName, staff.FullName, staff.LicenseNumber, staff.StaffType.ToString(), staff.Email, staff.PhoneNumber, staff.AvailabilitySlots.Select(slot => slot.ToString()).ToArray(), staff.SpecializationId.AsGuid(), staff.IsActive);
                var newOperationType = new OperationType("Cardiology Operation", "2 hours");
            
                _repository.Setup(repo => repo.GetByNameAsync(dto.Name))
                    .ReturnsAsync((OperationType)null); // No existing operation with the same name
            
                _specializationRepository.Setup(repo => repo.GetSpecIdByOptionAsync("Cardiology"))
                    .ReturnsAsync(specialization);
            
                _staffRepository.Setup(repo => repo.GetStaffBySpecializationIdAsync(It.IsAny<SpecializationId>()))
                    .ReturnsAsync(new List<Staff> { staff });
            
                _mapper.Setup(mapper => mapper.ToDomain(dto))
                    .Returns(newOperationType);
            
                _mapper.Setup(mapper => mapper.ToDto(It.IsAny<OperationType>()))
                    .Returns(new OperationTypeDTO(newOperationType.Id.AsGuid(), "Cardiology Operation", "2 hours", dto.Specializations.Select(name => new Specialization(name)).ToList(), new List<StaffDTO> { staffDto }));
            
                // Act
                var result = await _operationTypeService.CreateOperationTypeAsync(dto);
            
                // Assert
                _repository.Verify(repo => repo.AddAsync(newOperationType), Times.Once);
                _unitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
                Assert.NotNull(result);
                Assert.Equal("Cardiology Operation", result.Name);
                Assert.Equal("2 hours", result.EstimatedDuration);
                Assert.Single(result.Staffs);
                Assert.Equal("Joao Pereira", result.Staffs[0].FullName);
                Assert.Equal("Cardiology", result.Specializations[0].SpecOption);
            }



       /* [Fact]
        public async Task CreateOperationType_WithExistingName()
        {
            // Arrange
            var dto = new CreatingOperationTypeDTO
            {
                Name = "Cardiology Operation",
                EstimatedDuration = "2 hours",
                Specializations = new List<string> { "Cardiology" }
            };
        
            var existingOperationType = new OperationType("Cardiology Operation", "2 hours");
        
            _repository.Setup(repo => repo.GetByNameAsync(dto.Name))
                .ReturnsAsync(existingOperationType); // Existing operation with the same name
        
            // Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => _operationTypeService.CreateOperationTypeAsync(dto));
        
            Assert.Equal($"Operation type with the name '{dto.Name}' already exists.", exception.Message);
        }
        
        [Fact]
        public async Task CreateOperationType_WithNonExistingSpecialization_ShouldThrowKeyNotFoundException()
        {
            // Arrange
            var dto = new CreatingOperationTypeDTO
            {
                Name = "Cardiology Operation",
                EstimatedDuration = "2 hours",
                Specializations = new List<string> { "NonExistingSpecialization" }
            };
        
            _repository.Setup(repo => repo.GetByNameAsync(dto.Name))
                .ReturnsAsync((OperationType)null);
            _specializationRepository.Setup(repo => repo.GetSpecIdByOptionAsync("NonExistingSpecialization"))
                .ReturnsAsync((Specialization)null);
        
            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _operationTypeService.CreateOperationTypeAsync(dto));
        
            Assert.Equal($"Specialization with name 'NonExistingSpecialization' not found.", exception.Message);
        }*/

        [Fact]
        public async Task UpdateOperationTypeAsync_OperationTypeNotFound_ShouldThrowKeyNotFoundException()
        {
            // Arrange
            var operationTypeName = "NonExistingOperation";
            var dto = new UpdatingOperationTypeDTO
            {
                Name = "Updated Operation",
                EstimatedDuration = "3 hours",
                Specializations = new List<string> { ""}
            };

            _repository.Setup(repo => repo.GetByNameAsync(operationTypeName))
                .ReturnsAsync((OperationType)null); // OperationType not found

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _operationTypeService.UpdateOperationTypeAsync(operationTypeName, dto));

            Assert.Equal($"OperationType with name {operationTypeName} not found.", exception.Message);
        }

        [Fact]
        public async Task UpdateOperationTypeAsync_ShouldUpdateName()
        {
            var operationTypeName = "ExistingOperation";
            var dto = new UpdatingOperationTypeDTO
            {
                Name = "Updated Operation",
                EstimatedDuration = null,
                Specializations = new List<string>()
            };
            var existingOperationType = new OperationType("ExistingOperation", "2 hours");


            _repository.Setup(repo => repo.GetByNameAsync(operationTypeName))
                .ReturnsAsync(existingOperationType);

            _repository.Setup(repo => repo.UpdateAsync(existingOperationType))
                .Returns(Task.CompletedTask);

            _mapper.Setup(mapper => mapper.ToDto(It.IsAny<OperationType>()))
                .Returns((OperationType op) => new OperationTypeDTO(op.Id.AsGuid(), op.Name, op.EstimatedDuration, op.Specializations.ToList(), new List<StaffDTO>()));

            var result = await _operationTypeService.UpdateOperationTypeAsync(operationTypeName, dto);

            Assert.NotNull(result);
            Assert.Equal("Updated Operation", result.Name);

            Assert.Equal("Updated Operation", existingOperationType.Name);
            _repository.Verify(repo => repo.UpdateAsync(existingOperationType), Times.Once);
            _unitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }


        [Fact]
        public async Task UpdateOperationTypeAsync_ShouldUpdateEstimatedDuration()
        {
            // Arrange
            var operationTypeName = "ExistingOperation";
            var dto = new UpdatingOperationTypeDTO
            {
                Name = "",
                EstimatedDuration = "3 hours",
                Specializations = new List<string>()
            };

            var existingOperationType = new OperationType("ExistingOperation", "2 hours");

            // Set up the repository to return the existing operation type
            _repository.Setup(repo => repo.GetByNameAsync(operationTypeName))
                .ReturnsAsync(existingOperationType);

            _mapper.Setup(mapper => mapper.ToDto(It.IsAny<OperationType>()))
           .Returns((OperationType op) => new OperationTypeDTO(op.Id.AsGuid(), op.Name, op.EstimatedDuration, op.Specializations.ToList(), new List<StaffDTO>()));


            // Act
            var result = await _operationTypeService.UpdateOperationTypeAsync(operationTypeName, dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("3 hours", result.EstimatedDuration); // Verify the result
            Assert.Equal("3 hours", existingOperationType.EstimatedDuration); // Ensure existing operation type is updated
            _repository.Verify(repo => repo.UpdateAsync(existingOperationType), Times.Once);
            _unitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }

       /* [Fact]
        public async Task UpdateOperationTypeAsync_ShouldUpdateSpecializations()
        {

            var operationTypeName = "ExistingOperation";
            var specializationId = Guid.NewGuid();
            var dto = new UpdatingOperationTypeDTO
            {
                Name = "",
                EstimatedDuration = "",
                Specializations = new List<string> { "specializationId" }
            };

            var existingOperationType = new OperationType("ExistingOperation", "2 hours");
            var specialization = new Specialization("Cardiology");
            specialization.SetId(new SpecializationId(specializationId));

            _repository.Setup(repo => repo.GetByNameAsync(operationTypeName))
                .ReturnsAsync(existingOperationType);


            _specializationRepository.Setup(repo => repo.GetByIdAsync(It.IsAny<SpecializationId>()))
                .ReturnsAsync(specialization);

            _mapper.Setup(mapper => mapper.ToDto(It.IsAny<OperationType>()))
                .Returns((OperationType op) => new OperationTypeDTO(op.Id.AsGuid(), op.Name, op.EstimatedDuration, op.Specializations, new List<StaffDTO>()));

            // Act
            var result = await _operationTypeService.UpdateOperationTypeAsync(operationTypeName, dto);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Specializations);

            Assert.Single(existingOperationType.Specializations);
            Assert.Contains(specialization, existingOperationType.Specializations);

            _repository.Verify(repo => repo.UpdateAsync(existingOperationType), Times.Once);
            _unitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateOperationTypeAsync_WithNonExistingSpecialization()
        {
            // Arrange
            var operationTypeName = "ExistingOperation";
            var nonExistingSpecializationId = Guid.NewGuid();
            var dto = new UpdatingOperationTypeDTO
            {
                Name = null,
                EstimatedDuration = null,
                Specializations = new List<string> { "nonExistingSpecializationId" }
            };

            var existingOperationType = new OperationType("ExistingOperation", "2 hours");

            // Set up the repository to return the existing operation type
            _repository.Setup(repo => repo.GetByNameAsync(operationTypeName))
                .ReturnsAsync(existingOperationType);

            // Set up the specialization repository to return null for the non-existing specialization
            _specializationRepository.Setup(repo => repo.GetByIdAsync(It.IsAny<SpecializationId>()))
                .ReturnsAsync((Specialization)null); // Specialization does not exist

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _operationTypeService.UpdateOperationTypeAsync(operationTypeName, dto));

            Assert.Equal($"Specialization with ID {nonExistingSpecializationId} not found.", exception.Message);
        }*/


        [Fact]
        public async Task DeactivateOperationTypeAsync_OperationTypeNotFound()
        {
            // Arrange
            var operationName = "NonExistingOperation";

            _repository.Setup(repo => repo.GetByNameAsync(operationName))
                .ReturnsAsync((OperationType)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _operationTypeService.DeactivateOperationTypeAsync(operationName));

            Assert.Equal($"OperationType with name {operationName} not found.", exception.Message);
        }

        [Fact]
        public async Task DeactivateOperationTypeAsync()
        {
            // Arrange
            var operationName = "ExistingOperation";
            var existingOperationType = new OperationType("ExistingOperation", "2 hours");

            _repository.Setup(repo => repo.GetByNameAsync(operationName))
                .ReturnsAsync(existingOperationType);

            // Act
            await _operationTypeService.DeactivateOperationTypeAsync(operationName);

            // Assert
            Assert.False(existingOperationType.IsActive);
            _logRepository.Verify(logRepo => logRepo.AddAsync(It.Is<Log>(log => log.TypeOfAction == TypeOfAction.Delete && log.EntityId == existingOperationType.Id.ToString() && log.Message == $"OperationType '{operationName}' deactivated.")), Times.Once);
            _repository.Verify(repo => repo.UpdateAsync(existingOperationType), Times.Once);
            _unitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task ActivateOperationTypeAsync_OperationTypeNotFound()
        {
            // Arrange
            var operationName = "NonExistingOperation";

            _repository.Setup(repo => repo.GetByNameAsync(operationName))
                .ReturnsAsync((OperationType)null); // OperationType not found

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _operationTypeService.ActivateOperationTypeAsync(operationName));

            Assert.Equal($"OperationType with name {operationName} not found.", exception.Message);
        }

        [Fact]
        public async Task ActivateOperationTypeAsync_ShouldActivateOperationType()
        {
            // Arrange
            var operationName = "ExistingOperation";
            var existingOperationType = new OperationType("ExistingOperation", "2 hours");

            _repository.Setup(repo => repo.GetByNameAsync(operationName))
                .ReturnsAsync(existingOperationType);

            // Act
            await _operationTypeService.ActivateOperationTypeAsync(operationName);

            // Assert
            Assert.True(existingOperationType.IsActive);
            _logRepository.Verify(logRepo => logRepo
            .AddAsync(It.Is<Log>(log => log.TypeOfAction == TypeOfAction.Update && log.EntityId == existingOperationType.Id.ToString() && log.Message == $"OperationType '{operationName}' activated.")), Times.Once);
            _repository.Verify(repo => repo.UpdateAsync(existingOperationType), Times.Once);
            _unitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAllOperationsTypeAsync_NoOperationTypes()
        {
            // Arrange
            _repository.Setup(repo => repo.GetAllOpAsync())
                .ReturnsAsync(new List<OperationType>());

            // Act
            var result = await _operationTypeService.GetAllOperationsTypeAsync();

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetAllOperationsTypeAsync_OperationTypesExist()
        {
            // Arrange
            var specialization = new Specialization("Cardiology");
            var staff = new Staff("Joao", "Pereira", "Joao Pereira", "joao@gmail.com", "+351965265129", StaffType.Admin, specialization.Id);
            specialization.AddStaff(staff);

            var operationType = new OperationType("ExistingOperation", "2 hours");
            operationType.AddSpecialization(specialization);

            _repository.Setup(repo => repo.GetAllOpAsync())
                .ReturnsAsync(new List<OperationType> { operationType });

            _staffMapper.Setup(mapper => mapper.ToDto(It.IsAny<Staff>()))
                .Returns(new StaffDTO(staff.Id.AsGuid(), staff.FirstName, staff.LastName, staff.FullName, staff.Email, staff.PhoneNumber, staff.StaffType.ToString(), staff.LicenseNumber, staff.AvailabilitySlots.Select(slot => slot.ToString()).ToArray(), staff.SpecializationId.AsGuid(), staff.IsActive));

            // Act
            var result = await _operationTypeService.GetAllOperationsTypeAsync();

            // Assert
            Assert.Single(result);
            var operationTypeDTO = result.First();
            Assert.Equal(operationType.Id.AsGuid(), operationTypeDTO.Id);
            Assert.Equal(operationType.Name, operationTypeDTO.Name);
            Assert.Equal(operationType.EstimatedDuration.ToString(), operationTypeDTO.EstimatedDuration);
            Assert.Single(operationTypeDTO.Specializations);
        
            Assert.Single(operationTypeDTO.Staffs);
            var staffDTO = operationTypeDTO.Staffs.First();
            Assert.Equal(staff.Id.AsGuid(), staffDTO.Id);
            Assert.Equal(staff.FirstName, staffDTO.FirstName);
            Assert.Equal(staff.LastName, staffDTO.LastName);
            Assert.Equal(staff.FullName, staffDTO.FullName);
            Assert.Equal(staff.LicenseNumber, staffDTO.LicenseNumber);
            Assert.Equal(staff.Email, staffDTO.Email);
            Assert.Equal(staff.PhoneNumber, staffDTO.PhoneNumber); // Ensure this matches the expected value
            Assert.Equal(staff.SpecializationId.AsGuid(), staffDTO.SpecializationId);
        }

        [Fact]
        public async Task GetOperationTypesByNameAsync_OperationTypeNotFound()
        {
            // Arrange
            var operationName = "NonExistingOperation";

            _repository.Setup(repo => repo.GetByNameAsync(operationName))
                .ReturnsAsync((OperationType)null); // OperationType not found

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _operationTypeService.GetOperationTypesByNameAsync(operationName));

            Assert.Equal($"OperationType with Name {operationName} not found.", exception.Message);
        }

        [Fact]
        public async Task GetOperationTypesByNameAsync()
        {
            // Arrange
            var operationName = "ExistingOperation";
            var specialization = new Specialization("Cardiology");
            var staff = new Staff("Joao", "Pereira", "Joao Pereira", "joao@gmail.com", "+351965265129", StaffType.Admin, specialization.Id);
            specialization.AddStaff(staff);

            var operationType = new OperationType("ExistingOperation", "2 hours");
            operationType.AddSpecialization(specialization);

            _repository.Setup(repo => repo.GetByNameAsync(operationName))
                .ReturnsAsync(operationType);

            _staffMapper.Setup(mapper => mapper.ToDto(It.IsAny<Staff>()))
                .Returns(new StaffDTO(staff.Id.AsGuid(), staff.FirstName, staff.LastName, staff.FullName, staff.LicenseNumber, staff.StaffType.ToString(), staff.Email, staff.PhoneNumber, staff.AvailabilitySlots.Select(slot => slot.ToString()).ToArray(), staff.SpecializationId.AsGuid(), staff.IsActive));

            // Act
            var result = await _operationTypeService.GetOperationTypesByNameAsync(operationName);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationType.Id.AsGuid(), result.Id);
            Assert.Equal(operationType.Name, result.Name);
            Assert.Equal(operationType.EstimatedDuration, result.EstimatedDuration);
            Assert.Single(result.Specializations);
        
            Assert.Single(result.Staffs);
            var staffDTO = result.Staffs.First();

        }

        [Fact]
        public async Task GetOperationTypeWithStaffsAsync_OperationTypeNotFound()
        {
            // Arrange
            var operationTypeId = new OperationTypeId(Guid.NewGuid());

            _repository.Setup(repo => repo.GetOpStaffByIdAsync(operationTypeId, true))
                .ReturnsAsync((OperationType)null); // OperationType not found

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _operationTypeService.GetOperationTypeWithStaffsAsync(operationTypeId));

            Assert.Equal($"OperationType with ID {operationTypeId} not found.", exception.Message);
        }

        [Fact]
        public async Task GetOperationTypeWithStaffsAsync()
        {
            // Arrange
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var specialization = new Specialization("Cardiology");
            var staff = new Staff("Joao", "Pereira", "Joao Pereira", "joao@gmail.com", "+351965265129", StaffType.Admin, specialization.Id);
            specialization.AddStaff(staff);

            var operationType = new OperationType("ExistingOperation", "2 hours");
            operationType.AddSpecialization(specialization);

            _repository.Setup(repo => repo.GetOpStaffByIdAsync(operationTypeId, true))
                .ReturnsAsync(operationType);

            _staffMapper.Setup(mapper => mapper.ToDto(It.IsAny<Staff>()))
                .Returns(new StaffDTO(staff.Id.AsGuid(), staff.FirstName, staff.LastName, staff.FullName, staff.LicenseNumber, staff.StaffType.ToString(), staff.Email, staff.PhoneNumber, staff.AvailabilitySlots.Select(slot => slot.ToString()).ToArray(), staff.SpecializationId.AsGuid(), staff.IsActive));

            _mapper.Setup(mapper => mapper.ToDto(It.IsAny<OperationType>()))
                .Returns(new OperationTypeDTO(operationType.Id.AsGuid(), operationType.Name, operationType.EstimatedDuration, operationType.Specializations, new List<StaffDTO> { new StaffDTO(staff.Id.AsGuid(), staff.FirstName, staff.LastName, staff.FullName, staff.LicenseNumber, staff.StaffType.ToString(), staff.Email, staff.PhoneNumber, staff.AvailabilitySlots.Select(slot => slot.ToString()).ToArray(), staff.SpecializationId.AsGuid(), staff.IsActive) }));
            // Act
            var result = await _operationTypeService.GetOperationTypeWithStaffsAsync(operationTypeId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationType.Id.AsGuid(), result.Id);
            Assert.Equal(operationType.Name, result.Name);
            Assert.Equal(operationType.EstimatedDuration, result.EstimatedDuration);
            Assert.Single(result.Specializations);
            Assert.Single(result.Staffs);
            var staffDTO = result.Staffs.First();
            Assert.Equal(staff.Id.AsGuid(), staffDTO.Id);
        }

        [Fact]
        public async Task GetOperationTypesByStatusAsync_OperationTypeNotFound()
        {
            // Arrange
            var status = true;

            _repository.Setup(repo => repo.GetOpByStatusAsync(status))
                .ReturnsAsync((List<OperationType>)null); // OperationType not found

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _operationTypeService.GetOperationTypesByStatusAsync(status));

            Assert.Equal($"OperationType with status {status} not found.", exception.Message);
        }

        [Fact]
        public async Task GetOperationTypesByStatusTrueAsync()
        {
            // Arrange
            var status = true;
            var operationType = new OperationType("ExistingOperation", "2 hours");

            _repository.Setup(repo => repo.GetOpByStatusAsync(status))
                .ReturnsAsync([operationType]);

            // Act
            var result = await _operationTypeService.GetOperationTypesByStatusAsync(status);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            var returnedOperationType = result.First();
            Assert.Equal(operationType.Id, returnedOperationType.Id);
            Assert.Equal(operationType.Name, returnedOperationType.Name);
            Assert.Equal(operationType.EstimatedDuration, returnedOperationType.EstimatedDuration);
        }

        [Fact]
        public async Task GetOperationTypesByStatusFalseAsync()
        {
            // Arrange
            var status = false;
            var operationType = new OperationType("ExistingOperation", "2 hours");

            _repository.Setup(repo => repo.GetOpByStatusAsync(status))
                .ReturnsAsync([operationType]);

            // Act
            var result = await _operationTypeService.GetOperationTypesByStatusAsync(status);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            var returnedOperationType = result.First();
            Assert.Equal(operationType.Id, returnedOperationType.Id);
            Assert.Equal(operationType.Name, returnedOperationType.Name);
            Assert.Equal(operationType.EstimatedDuration, returnedOperationType.EstimatedDuration);
        }

    }
}


