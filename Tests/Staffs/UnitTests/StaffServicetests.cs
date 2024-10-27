using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Shared;
using Moq;
using Xunit;
using DDDSample1.Domain.Logs;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http.HttpResults;

namespace DDDSample1.Tests.Staffs.UnitTests
{
    [Collection("Staff Service Collection")]
    public class StaffServiceTests
    {
        private readonly StaffService _service;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IStaffRepository> _staffRepositoryMock;
        private readonly Mock<IStaffMapper> _staffMapperMock;
        private readonly Mock<ISpecializationRepository> _specializationRepositoryMock;
        private readonly Mock<ILogRepository> _logRepositoryMock;
        private readonly Mock<IMailService> _mailServiceMock;
        private readonly Mock<IConfiguration> _configurationMock;
        

        public StaffServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _staffRepositoryMock = new Mock<IStaffRepository>();
            _staffMapperMock = new Mock<IStaffMapper>();
            _specializationRepositoryMock = new Mock<ISpecializationRepository>();
            _logRepositoryMock = new Mock<ILogRepository>();
            _mailServiceMock = new Mock<IMailService>();
            _configurationMock = new Mock<IConfiguration>();

            _configurationMock.Setup(config => config["Jwt:Key"])
                              .Returns("your-very-secure-key-that-is-at-least-256-bits-long");

            _service = new StaffService(
                _unitOfWorkMock.Object,
                _staffRepositoryMock.Object,
                _staffMapperMock.Object,
                _specializationRepositoryMock.Object,
                _logRepositoryMock.Object,
                _mailServiceMock.Object,
                _configurationMock.Object
            );
        }

        private Specialization CreateSampleSpecialization() => new Specialization("Specialization");
        private Staff CreateSampleStaff(Specialization specialization)
        {
            return new Staff(
                "Teste",
                "Afonso",
                "Teste Afonso",
                "teste@gmail.com",
                "+351932392503",
                specialization.Id
            );
        }
        private CreatingStaffDTO CreateSampleCreatingStaffDTO(Specialization specialization)
        {
            return new CreatingStaffDTO(
                "Teste",
                "Afonso",
                "Teste Afonso",
                "teste@gmail.com",
                "+351932392503",
                "Specialization"
            );
        }

        private List<Staff> CreateSampleStaffs(Specialization specialization1, Specialization specialization2, Specialization specialization3) => new List<Staff>
        {
            new Staff(
                "Maria",
                "Silva",
                "Maria Silva",
                "maria.silva@example.com",
                "+351912345678",
                specialization1.Id
            ),
            new Staff(
                "João",
                "Pereira",
                "João Pereira",
                "joao.pereira@example.com",
                "+351912345679",
                specialization2.Id
            ),
            new Staff(
                "Ana",
                "Costa",
                "Ana Costa",
                "ana.costa@example.com",
                "+351912345680",
                specialization3.Id
            ),
            new Staff(
                "Pedro",
                "Ferreira",
                "Pedro Ferreira",
                "pedro.ferreira@example.com",
                "+351912345681",
                specialization1.Id
            ),
            new Staff(
                "Sofia",
                "Rodrigues",
                "Sofia Rodrigues",
                "sofia.rodrigues@example.com",
                "+351912345682",
                specialization2.Id
            ),
            new Staff(
                "Sofia",
                "Sousa",
                "Sofia Sousa",
                "sofia.sousa@example.com",
                "+351912345681",
                specialization3.Id
            )
        };

        private StaffDTO CreateSampleStaffDTO(Staff expectedStaff)
        {
            return new StaffDTO(
                expectedStaff.Id.AsGuid(),
                expectedStaff.FirstName,
                expectedStaff.LastName,
                expectedStaff.FullName,
                expectedStaff.Email,
                expectedStaff.PhoneNumber,
                expectedStaff.LicenseNumber,
                expectedStaff.AvailabilitySlots.Select(slot => slot.ToString()).ToArray(),
                expectedStaff.SpecializationId.AsGuid(),
                expectedStaff.IsActive
            );
        }

        //CreateStaffAsync Tests
        [Fact]
        public async Task CreateStaffAsynSuccessfullyTest()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var dto = CreateSampleCreatingStaffDTO(specialization);
            var expectedStaff = CreateSampleStaff(specialization);
            var expectedStaffDTO = CreateSampleStaffDTO(expectedStaff);

            _specializationRepositoryMock.Setup(r => r.GetSpecIdByOptionAsync(dto.SpecializationName)).ReturnsAsync(specialization);
            _staffMapperMock.Setup(m => m.ToDomain(dto)).Returns(expectedStaff);
            _staffRepositoryMock.Setup(r => r.GetByEmailAsync(expectedStaff.Email)).ReturnsAsync((Staff)null);
            _staffRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(expectedStaff.PhoneNumber)).ReturnsAsync((Staff)null);
            _staffRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Staff>());
            _staffRepositoryMock.Setup(r => r.AddAsync(expectedStaff)).ReturnsAsync(expectedStaff);
            _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns((Staff s) => CreateSampleStaffDTO(s));

            // Act
            var createdStaffDTO = await _service.CreateStaffAsync(dto);

            // Assert
            Assert.NotNull(createdStaffDTO);
            Assert.IsType<StaffDTO>(createdStaffDTO);

            Assert.Equal(expectedStaffDTO.FirstName, createdStaffDTO.FirstName);
            Assert.Equal(expectedStaffDTO.LastName, createdStaffDTO.LastName);
            Assert.Equal(expectedStaffDTO.FullName, createdStaffDTO.FullName);
            Assert.Equal(expectedStaffDTO.Email, createdStaffDTO.Email);
            Assert.Equal(expectedStaffDTO.PhoneNumber, createdStaffDTO.PhoneNumber);
            Assert.Equal(expectedStaffDTO.SpecializationId, createdStaffDTO.SpecializationId);

            _specializationRepositoryMock.Verify(r => r.GetSpecIdByOptionAsync(dto.SpecializationName), Times.Once);
            _staffMapperMock.Verify(m => m.ToDomain(dto), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByEmailAsync(expectedStaff.Email), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(expectedStaff.PhoneNumber), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetAllAsync(), Times.Once);
            _staffRepositoryMock.Verify(r => r.AddAsync(expectedStaff), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            _staffMapperMock.Verify(m => m.ToDto(expectedStaff), Times.Once);
        }

        [Fact]
        public async Task CreateStaffFailsDueToDuplicatePhoneNumberTest()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var dto = CreateSampleCreatingStaffDTO(specialization);
            var existingStaff = CreateSampleStaff(specialization);

            _specializationRepositoryMock.Setup(r => r.GetSpecIdByOptionAsync(dto.SpecializationName)).ReturnsAsync(specialization);
            _staffMapperMock.Setup(m => m.ToDomain(dto)).Returns(existingStaff);
            _staffRepositoryMock.Setup(r => r.GetByEmailAsync(existingStaff.Email)).ReturnsAsync((Staff)null);
            _staffRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(existingStaff.PhoneNumber)).ReturnsAsync(existingStaff);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.CreateStaffAsync(dto));

            _specializationRepositoryMock.Verify(r => r.GetSpecIdByOptionAsync(dto.SpecializationName), Times.Once);
            _staffMapperMock.Verify(m => m.ToDomain(dto), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByEmailAsync(existingStaff.Email), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(existingStaff.PhoneNumber), Times.Once);
            _specializationRepositoryMock.Verify(r => r.GetByIdAsync(existingStaff.SpecializationId), Times.Never);
            _staffRepositoryMock.Verify(r => r.GetAllAsync(), Times.Never);
            _staffRepositoryMock.Verify(r => r.AddAsync(existingStaff), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }
        

        [Fact]
        public async Task CreateStaffFailsDueToDuplicateEmailTest()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var dto = CreateSampleCreatingStaffDTO(specialization);
            var existingStaff = CreateSampleStaff(specialization);

             _specializationRepositoryMock.Setup(r => r.GetSpecIdByOptionAsync(dto.SpecializationName)).ReturnsAsync(specialization);
            _staffMapperMock.Setup(m => m.ToDomain(dto)).Returns(existingStaff);
            _staffRepositoryMock.Setup(r => r.GetByEmailAsync(existingStaff.Email)).ReturnsAsync(existingStaff);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.CreateStaffAsync(dto));

            _specializationRepositoryMock.Verify(r => r.GetSpecIdByOptionAsync(dto.SpecializationName), Times.Once);
            _staffMapperMock.Verify(m => m.ToDomain(dto), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByEmailAsync(existingStaff.Email), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(existingStaff.PhoneNumber), Times.Never);
            _staffRepositoryMock.Verify(r => r.GetAllAsync(), Times.Never);
            _staffRepositoryMock.Verify(r => r.AddAsync(existingStaff), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task CreateStaffFailsDueToSpecializationNotFoundTest()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var dto = CreateSampleCreatingStaffDTO(specialization);
            var existingStaff = CreateSampleStaff(specialization);
            
             _specializationRepositoryMock.Setup(r => r.GetSpecIdByOptionAsync(dto.SpecializationName)).ReturnsAsync((Specialization)null);
            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.CreateStaffAsync(dto));

            _specializationRepositoryMock.Verify(r => r.GetSpecIdByOptionAsync(dto.SpecializationName), Times.Once);
            _staffMapperMock.Verify(m => m.ToDomain(dto), Times.Never);
            _staffRepositoryMock.Verify(r => r.GetByEmailAsync(existingStaff.Email), Times.Never);
            _staffRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(existingStaff.PhoneNumber), Times.Never);
            _staffRepositoryMock.Verify(r => r.GetAllAsync(), Times.Never);
            _staffRepositoryMock.Verify(r => r.AddAsync(existingStaff), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }

        //ActivateStaffAsync Tests
        [Fact]
        public async Task DeactivateStaffAsyncSuccessfullyTest()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var existingStaff = CreateSampleStaff(specialization);
            var staffId = existingStaff.Id.AsGuid();

            string message = $"Staff profile {existingStaff.FullName} (ID: {existingStaff.Id}) has been deactivated.";
            var log = new Log(TypeOfAction.Deactivate, existingStaff.Id.ToString(), message);

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(existingStaff.Id)).ReturnsAsync(existingStaff);
            _logRepositoryMock.Setup(r => r.AddAsync(It.IsAny<Log>())).ReturnsAsync(log);
            _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns((Staff s) => CreateSampleStaffDTO(s));

            // Act
            var result = await _service.DeactivateStaffAsync(staffId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<StaffDTO>(result);
            Assert.Equal(existingStaff.FirstName, result.FirstName);
            Assert.Equal(existingStaff.LastName, result.LastName);
            Assert.Equal(existingStaff.FullName, result.FullName);
            Assert.Equal(existingStaff.LicenseNumber.ToString(), result.LicenseNumber);
            Assert.Equal(existingStaff.Email, result.Email);
            Assert.Equal(existingStaff.PhoneNumber, result.PhoneNumber);
            Assert.Equal(existingStaff.AvailabilitySlots.Select(date => date.ToString()).ToArray(), result.AvailabilitySlots);
            Assert.Equal(existingStaff.SpecializationId.AsGuid(), result.SpecializationId);
            Assert.False(result.IsActive);
            _staffRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<StaffId>()), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task DeactivateStaffAsyncFailsStaffAlreadyDeactivatedTest()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var existingStaff = CreateSampleStaff(specialization);
            var staffId = existingStaff.Id.AsGuid();
            existingStaff.Deactivate(); // staff is already deactivated
            _staffRepositoryMock.Setup(r => r.GetByIdAsync(existingStaff.Id)).ReturnsAsync(existingStaff);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.DeactivateStaffAsync(staffId));

            _staffRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<StaffId>()), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task DeactivateStaffAsyncFailsStaffNotFoundTest()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var existingStaff = CreateSampleStaff(specialization);
            var staffId = existingStaff.Id.AsGuid();
            _staffRepositoryMock.Setup(r => r.GetByIdAsync(existingStaff.Id)).ReturnsAsync((Staff)null);

            // Act & Assert
            var result = await _service.DeactivateStaffAsync(staffId);
        
            // Assert
            Assert.Null(result);
            _staffRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<StaffId>()), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }

        //UpdateStaffAsync Tests
        [Fact]
        public async Task UpdateStaffAsync_SuccessfullyUpdatesStaff()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var newspecialization = new Specialization("newSpecialization");
            var existingStaff = CreateSampleStaff(specialization);
            existingStaff.AddAvailabilitySlot(DateTime.Parse("2024-11-09 10:00"));
            var staffId = existingStaff.Id.AsGuid();

            var dto = new UpdateStaffDTO
            {
                PhoneNumber = "+351912345679",
                Email = "teste23123@gmail.com", 
                AddAvailabilitySlots = "2024-11-10 14:00,2024-11-11 09:00",
                RemoveAvailabilitySlots = "2024-11-09 10:00",
                SpecializationName = newspecialization.SpecOption
            };

            string message = "Staff updated. The following fields were updated: Sent confirmation email to Staff to update phone number, Sent confirmation email to Staff to update email, Added Availability Slots, Removed Availability Slots, Specialization.";
            var log = new Log(TypeOfAction.Update, existingStaff.Id.ToString(), message);

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(existingStaff.Id)).ReturnsAsync(existingStaff);
            _staffRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(dto.PhoneNumber)).ReturnsAsync((Staff)null);
            _staffRepositoryMock.Setup(r => r.GetByEmailAsync(dto.Email)).ReturnsAsync((Staff)null);
            _configurationMock.SetupGet(c => c["Jwt:Key"]).Returns("your-very-secure-key-that-is-at-least-256-bits-long");
            _mailServiceMock.Setup(m => m.SendEmailToStaff(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<UpdateStaffDTO>(), It.IsAny<string>())).Returns(Task.CompletedTask);
            _specializationRepositoryMock.Setup(s => s.GetSpecIdByOptionAsync(dto.SpecializationName)).ReturnsAsync(newspecialization);
            _logRepositoryMock.Setup(l => l.AddAsync(It.IsAny<Log>())).ReturnsAsync(log);

            var addSlots = dto.AddAvailabilitySlots.Split(',')
                            .Select(slot => DateTime.Parse(slot.Trim()))
                            .ToArray();

            _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns((Staff s) => CreateSampleStaffDTO(s));

            // Act
            var result = await _service.UpdateStaffAsync(staffId, dto);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<StaffDTO>(result);

            Assert.Equal(addSlots.Select(date => date.ToString()).ToArray(), result.AvailabilitySlots);
            Assert.Equal(dto.SpecializationId.ToString(), result.SpecializationId.ToString());

            _staffRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<StaffId>()), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(dto.PhoneNumber), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByEmailAsync(dto.Email), Times.Once);
            _configurationMock.VerifyGet(c => c["Jwt:Key"], Times.Once);
            _mailServiceMock.Verify(m => m.SendEmailToStaff(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<UpdateStaffDTO>(), It.IsAny<string>()), Times.Once);
            _specializationRepositoryMock.Verify(r => r.GetSpecIdByOptionAsync(dto.SpecializationName), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            _staffMapperMock.Verify(m => m.ToDto(It.IsAny<Staff>()), Times.Once);
        }

        [Fact]
        public async Task UpdateStaffAsync_StaffNotFound_ReturnsNull()
        {
            // Arrange
            var staffId = Guid.NewGuid();
            var dto = new UpdateStaffDTO
            {
                PhoneNumber = "+351912345679",
                Email = "teste23123@gmail.com",
                AddAvailabilitySlots = "2024-11-10 14:00,2024-11-11 09:00",
                RemoveAvailabilitySlots = "2024-11-09 10:00",
                SpecializationName = "newSpecialization"
            };

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<StaffId>())).ReturnsAsync((Staff)null);

            // Act
            var result = await _service.UpdateStaffAsync(staffId, dto);
            

            // Assert
            Assert.Null(result);
            _staffRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<StaffId>()), Times.Once);
        }

        [Fact]
        public async Task UpdateStaffAsync_PhoneNumberAlreadyInUse_ThrowsException()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var existingStaff = CreateSampleStaff(specialization);
            var staffId = existingStaff.Id.AsGuid();

            var dto = new UpdateStaffDTO
            {
                PhoneNumber = "+351912345679"
            };

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(existingStaff.Id)).ReturnsAsync(existingStaff);
            _staffRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(dto.PhoneNumber)).ReturnsAsync(new Staff());

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateStaffAsync(staffId, dto));
            _staffRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<StaffId>()), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(dto.PhoneNumber), Times.Once);
        }

        [Fact]
        public async Task UpdateStaffAsync_EmailAlreadyInUse_ThrowsException()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var existingStaff = CreateSampleStaff(specialization);
            var staffId = existingStaff.Id.AsGuid();

            var dto = new UpdateStaffDTO
            {
                Email = "teste23123@gmail.com"
            };

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(existingStaff.Id)).ReturnsAsync(existingStaff);
            _staffRepositoryMock.Setup(r => r.GetByEmailAsync(dto.Email)).ReturnsAsync(new Staff());

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateStaffAsync(staffId, dto));
            _staffRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<StaffId>()), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByEmailAsync(dto.Email), Times.Once);
        }

        [Fact]
        public async Task UpdateStaffAsync_AddAvailabilitySlots_InvalidFormat_ThrowsException()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var existingStaff = CreateSampleStaff(specialization);
            var staffId = existingStaff.Id.AsGuid();

            var dto = new UpdateStaffDTO
            {
                AddAvailabilitySlots = "invalid-date-format"    
            };

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(existingStaff.Id)).ReturnsAsync(existingStaff);
            _configurationMock.SetupGet(c => c["Jwt:Key"]).Returns("your-very-secure-key-that-is-at-least-256-bits-long");

            // Act & Assert
            await Assert.ThrowsAsync<FormatException>(() => _service.UpdateStaffAsync(staffId, dto));
            _staffRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<StaffId>()), Times.Once);
        }

        
        [Fact]
        public async Task UpdateStaffAsync_RemvoveAvailabilitySlots_InvalidFormat_ThrowsException()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var existingStaff = CreateSampleStaff(specialization);
            var staffId = existingStaff.Id.AsGuid();

            var dto = new UpdateStaffDTO
            {
                RemoveAvailabilitySlots = "invalid-date-format"    
            };

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(existingStaff.Id)).ReturnsAsync(existingStaff);
            _configurationMock.SetupGet(c => c["Jwt:Key"]).Returns("your-very-secure-key-that-is-at-least-256-bits-long");

            // Act & Assert
            await Assert.ThrowsAsync<FormatException>(() => _service.UpdateStaffAsync(staffId, dto));
            _staffRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<StaffId>()), Times.Once);
        }

        [Fact]
        public async Task UpdateStaffAsync_SpecializationNotFound_ThrowsException()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var existingStaff = CreateSampleStaff(specialization);
            var staffId = existingStaff.Id.AsGuid();

            var dto = new UpdateStaffDTO
            {
                SpecializationName = "nonexistentSpecialization"
            };

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(existingStaff.Id)).ReturnsAsync(existingStaff);
            _specializationRepositoryMock.Setup(s => s.GetSpecIdByOptionAsync(dto.SpecializationName)).ReturnsAsync((Specialization)null);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateStaffAsync(staffId, dto));
            _staffRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<StaffId>()), Times.Once);
            _specializationRepositoryMock.Verify(s => s.GetSpecIdByOptionAsync(dto.SpecializationName), Times.Once);
        }

        //SearchStaff Tests
        [Fact]
        public async Task SearchStaffProfiles_ReturnsListOfStaffDTO_WhenStaffProfilesFound()
        {
            // Arrange
            var specialization1 = CreateSampleSpecialization();
            var specialization2 = new Specialization("Cardiology");
            var specialization3 = new Specialization("Neurology");
            var sampleStaffList = CreateSampleStaffs(specialization1, specialization2, specialization3);

            var searchDto = new SearchStaffDTO
            {
                FirstName = "Sofia"
            };

            // Mock para buscar staff com base nos critérios do DTO
            _staffRepositoryMock.Setup(r => r.SearchStaffAsync(searchDto)).ReturnsAsync(sampleStaffList.Where(p => p.FirstName == searchDto.FirstName).ToList());

            // Mock para mapear cada staff para StaffDTO
            _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns((Staff s) => CreateSampleStaffDTO(s));

            // Act
            var result = await _service.SearchStaffProfiles(searchDto);

            // Assert
            Assert.NotNull(result);
            Assert.All(result, staff => Assert.Contains("Sofia", staff.FirstName));
            _staffRepositoryMock.Verify(r => r.SearchStaffAsync(searchDto), Times.Once);
        }


        [Fact]
        public async Task SearchStaffProfiles_ReturnsNull_WhenNoStaffProfilesFound()
        {
            // Arrange
            var searchDto = new SearchStaffDTO
            {
                FirstName = "NonExistent"
            };

            _staffRepositoryMock.Setup(r => r.SearchStaffAsync(searchDto)).ReturnsAsync(new List<Staff>());

            // Act
            var result = await _service.SearchStaffProfiles(searchDto);

            // Assert
            Assert.Null(result);
            _staffRepositoryMock.Verify(r => r.SearchStaffAsync(searchDto), Times.Once);
        }



        [Fact]
        public async Task SearchStaffProfiles_ReturnsListOfStaffDTO_WhenSpecializationNameProvidedAndFound()
        {
            // Arrange
            var specialization1 = CreateSampleSpecialization();
            var specialization2 = new Specialization("Cardiology");
            var specialization3 = new Specialization("Neurology");
            var sampleStaffList = CreateSampleStaffs(specialization1, specialization2, specialization3);

            var searchDto = new SearchStaffDTO
            {
                SpecializationName = "Cardiology"
            };

            _specializationRepositoryMock.Setup(r => r.GetSpecIdByOptionAsync(searchDto.SpecializationName)).ReturnsAsync(specialization2);
            _staffRepositoryMock.Setup(r => r.SearchStaffAsync(searchDto)).ReturnsAsync(sampleStaffList.Where(s => s.SpecializationId == specialization2.Id).ToList());

            _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns((Staff s) => CreateSampleStaffDTO(s));

            // Act
            var result = await _service.SearchStaffProfiles(searchDto);

            // Assert
            Assert.NotNull(result);
            Assert.All(result, staff => Assert.Equal(searchDto.SpecializationId, staff.SpecializationId));
            _specializationRepositoryMock.Verify(r => r.GetSpecIdByOptionAsync(searchDto.SpecializationName), Times.Once);
            _staffRepositoryMock.Verify(r => r.SearchStaffAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task SearchStaffProfiles_ThrowsException_WhenSpecializationNameProvidedAndNotFound()
        {
            // Arrange
            var searchDto = new SearchStaffDTO
            {
                SpecializationName = "NonExistentSpecialization"
            };

            _specializationRepositoryMock.Setup(r => r.GetSpecIdByOptionAsync(searchDto.SpecializationName)).ReturnsAsync((Specialization)null);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.SearchStaffProfiles(searchDto));
            _specializationRepositoryMock.Verify(r => r.GetSpecIdByOptionAsync(searchDto.SpecializationName), Times.Once);
        }

        [Fact]
        public async Task SearchStaffProfiles_ReturnsListOfStaffDTO_WhenSpecializationAllFiealdsProvidedAndFound()
        {
            // Arrange
            var specialization1 = CreateSampleSpecialization();
            var specialization2 = new Specialization("Cardiology");
            var specialization3 = new Specialization("Neurology");
            var sampleStaffList = CreateSampleStaffs(specialization1, specialization2, specialization3);

            var searchDto = new SearchStaffDTO
            {
                FirstName = "João",
                LastName = "Pereira",
                FullName = "João Pereira",
                Email = "joao.pereira@example.com",
                SpecializationName = "Cardiology"
            };

            _specializationRepositoryMock.Setup(r => r.GetSpecIdByOptionAsync(searchDto.SpecializationName)).ReturnsAsync(specialization2);
            _staffRepositoryMock.Setup(r => r.SearchStaffAsync(searchDto)).ReturnsAsync(sampleStaffList.Where(s =>
                s.FirstName == searchDto.FirstName &&
                s.LastName == searchDto.LastName &&
                s.FullName == searchDto.FullName &&
                s.Email == searchDto.Email &&
                s.SpecializationId == specialization2.Id).ToList());

            _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns((Staff s) => CreateSampleStaffDTO(s));

            // Act
            var result = await _service.SearchStaffProfiles(searchDto);

            // Assert
            Assert.NotNull(result);
            
            Assert.All(result, staff => Assert.Equal(searchDto.FirstName, staff.FirstName));
            Assert.All(result, staff => Assert.Equal(searchDto.LastName, staff.LastName));
            Assert.All(result, staff => Assert.Equal(searchDto.FullName, staff.FullName));
            Assert.All(result, staff => Assert.Equal(searchDto.Email, staff.Email));
            Assert.All(result, staff => Assert.Equal(specialization2.Id.AsGuid(), staff.SpecializationId));
            
            _specializationRepositoryMock.Verify(r => r.GetSpecIdByOptionAsync(searchDto.SpecializationName), Times.Once);
            _staffRepositoryMock.Verify(r => r.SearchStaffAsync(searchDto), Times.Once);
        }

                [Fact]
        public async Task UpdateContactInformationAsync_SuccessfullyUpdatesPhoneNumberAndEmail()
        {
            // Arrange
            var phoneNumber = "+351912345679";
            var email = "newemail@example.com";
            var specialization = CreateSampleSpecialization();
            var staff = CreateSampleStaff(specialization);
            var token = _service.CreateTokenStaff(staff);
            var staffId = staff.Id;

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(staffId)).ReturnsAsync(staff);
           _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns((Staff s) => CreateSampleStaffDTO(s));
           
            // Act
            var result = await _service.UpdateContactInformationAsync(token, phoneNumber, email);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(phoneNumber, result.PhoneNumber);
            Assert.Equal(email, result.Email);

            _staffRepositoryMock.Verify(r => r.GetByIdAsync(staffId), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            _staffMapperMock.Verify(m => m.ToDto(staff), Times.Once);
        }

        [Fact]
        public async Task UpdateContactInformationAsync_StaffNotFound_ThrowsException()
        {
            // Arrange
            var phoneNumber = "+351912345679";
            var email = "newemail@example.com";
            var specialization = CreateSampleSpecialization();
            var staff = CreateSampleStaff(specialization);
            var token = _service.CreateTokenStaff(staff);
            var staffId = staff.Id;


            _staffRepositoryMock.Setup(r => r.GetByIdAsync(staffId)).ReturnsAsync((Staff)null);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateContactInformationAsync(token, phoneNumber, email));

            _staffRepositoryMock.Verify(r => r.GetByIdAsync(staffId), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task UpdateContactInformationAsync_OnlyUpdatesPhoneNumber()
        {
            // Arrange
            var phoneNumber = "+351912345679";
            var email = string.Empty;
            var specialization = CreateSampleSpecialization();
            var staff = CreateSampleStaff(specialization);
            var token = _service.CreateTokenStaff(staff);
            var staffId = staff.Id;

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(staffId)).ReturnsAsync(staff);
            _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns((Staff s) => CreateSampleStaffDTO(s));

            // Act
            var result = await _service.UpdateContactInformationAsync(token, phoneNumber, email);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(phoneNumber, result.PhoneNumber);
            Assert.Equal(staff.Email, result.Email);

            _staffRepositoryMock.Verify(r => r.GetByIdAsync(staffId), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            _staffMapperMock.Verify(m => m.ToDto(It.IsAny<Staff>()), Times.Once);
        }

        [Fact]
        public async Task UpdateContactInformationAsync_OnlyUpdatesEmail()
        {
            // Arrange
            var phoneNumber = string.Empty;
            var email = "newemail@example.com";
            var specialization = CreateSampleSpecialization();
            var staff = CreateSampleStaff(specialization);
            var token = _service.CreateTokenStaff(staff);
            var staffId = staff.Id;

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(staffId)).ReturnsAsync(staff);
            _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns((Staff s) => CreateSampleStaffDTO(s));

            // Act
            var result = await _service.UpdateContactInformationAsync(token, phoneNumber, email);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(staff.PhoneNumber, result.PhoneNumber);
            Assert.Equal(email, result.Email);

            _staffRepositoryMock.Verify(r => r.GetByIdAsync(staffId), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            _staffMapperMock.Verify(m => m.ToDto(It.IsAny<Staff>()), Times.Once);
        }

        [Fact]
        public async Task UpdateContactInformationAsync_NoUpdatesMade()
        {
            // Arrange
            var phoneNumber = string.Empty;
            var email = string.Empty;
            var specialization = CreateSampleSpecialization();
            var staff = CreateSampleStaff(specialization);
            var token = _service.CreateTokenStaff(staff);
            var staffId = staff.Id;

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(staffId)).ReturnsAsync(staff);
            _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns((Staff s) => CreateSampleStaffDTO(s));

            // Act
            var result = await _service.UpdateContactInformationAsync(token, phoneNumber, email);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<StaffDTO>(result);
            Assert.Equal(staff.PhoneNumber, result.PhoneNumber);
            Assert.Equal(staff.Email, result.Email);

            _staffRepositoryMock.Verify(r => r.GetByIdAsync(staffId), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
            _staffMapperMock.Verify(m => m.ToDto(staff), Times.Once);
        }
    }
}   
