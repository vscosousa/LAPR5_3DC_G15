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

        public StaffServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _staffRepositoryMock = new Mock<IStaffRepository>();
            _staffMapperMock = new Mock<IStaffMapper>();
            _specializationRepositoryMock = new Mock<ISpecializationRepository>();
            _logRepositoryMock = new Mock<ILogRepository>();
            _mailServiceMock = new Mock<IMailService>();

            _service = new StaffService(
                _unitOfWorkMock.Object,
                _staffRepositoryMock.Object,
                _staffMapperMock.Object,
                _specializationRepositoryMock.Object,
                _logRepositoryMock.Object,
                _mailServiceMock.Object
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
                specialization.Id.AsGuid()
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

        [Fact]
        public async Task CreateStaffAsynSuccessfullyTest()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var dto = CreateSampleCreatingStaffDTO(specialization);
            var expectedStaff = CreateSampleStaff(specialization);
            var expectedStaffDTO = CreateSampleStaffDTO(expectedStaff);

            _staffMapperMock.Setup(m => m.ToDomain(dto)).Returns(expectedStaff);
            _staffMapperMock.Setup(m => m.ToDto(expectedStaff)).Returns(expectedStaffDTO);
            _staffRepositoryMock.Setup(r => r.GetByEmailAsync(expectedStaff.Email)).ReturnsAsync((Staff)null);
            _staffRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(expectedStaff.PhoneNumber)).ReturnsAsync((Staff)null);
            _specializationRepositoryMock.Setup(r => r.GetByIdAsync(expectedStaff.SpecializationId)).ReturnsAsync(specialization);
            _staffRepositoryMock.Setup(r => r.AddAsync(expectedStaff)).ReturnsAsync(expectedStaff);

            // Act
            var createdStaffDTO = await _service.CreateStaffAsync(dto);

            // Assert
            Assert.NotNull(createdStaffDTO);
            Assert.IsType<StaffDTO>(createdStaffDTO);

            Assert.Equal(expectedStaffDTO.FirstName, createdStaffDTO.FirstName);
            Assert.Equal(expectedStaffDTO.LastName, createdStaffDTO.LastName);
            Assert.Equal(expectedStaffDTO.FullName, createdStaffDTO.FullName);
            Assert.Equal(expectedStaffDTO.LicenseNumber, createdStaffDTO.LicenseNumber);
            Assert.Equal(expectedStaffDTO.Email, createdStaffDTO.Email);
            Assert.Equal(expectedStaffDTO.PhoneNumber, createdStaffDTO.PhoneNumber);
            Assert.Equal(expectedStaffDTO.SpecializationId, createdStaffDTO.SpecializationId);

            _staffMapperMock.Verify(m => m.ToDomain(dto), Times.Once);
            _staffMapperMock.Verify(m => m.ToDto(expectedStaff), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByEmailAsync(expectedStaff.Email), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(expectedStaff.PhoneNumber), Times.Once);
            _specializationRepositoryMock.Verify(r => r.GetByIdAsync(expectedStaff.SpecializationId), Times.Once);
            _staffRepositoryMock.Verify(r => r.AddAsync(expectedStaff), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
        }

        private StaffDTO CreateSampleStaffDTO(Staff expectedStaff)
        {
            return new StaffDTO(
                expectedStaff.Id.AsGuid(),
                expectedStaff.FirstName,
                expectedStaff.LastName,
                expectedStaff.FullName,
                expectedStaff.LicenseNumber,
                expectedStaff.Email,
                expectedStaff.PhoneNumber,
                expectedStaff.AvailabilitySlots.Select(slot => slot.ToString()).ToArray(),
                expectedStaff.SpecializationId,
                expectedStaff.IsActive
            );
        }

        [Fact]
        public async Task CreateStaffFailsDueToDuplicateEmailTest()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var dto = CreateSampleCreatingStaffDTO(specialization);
            var existingStaff = CreateSampleStaff(specialization);

            _staffMapperMock.Setup(m => m.ToDomain(dto)).Returns(existingStaff);
            _staffRepositoryMock.Setup(r => r.GetByEmailAsync(existingStaff.Email)).ReturnsAsync(existingStaff);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.CreateStaffAsync(dto));

            _staffMapperMock.Verify(m => m.ToDomain(dto), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByEmailAsync(existingStaff.Email), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(existingStaff.PhoneNumber), Times.Never);
            _specializationRepositoryMock.Verify(r => r.GetByIdAsync(existingStaff.SpecializationId), Times.Never);
            _staffRepositoryMock.Verify(r => r.AddAsync(existingStaff), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task CreateStaffFailsDueToDuplicatePhoneNumberTest()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var dto = CreateSampleCreatingStaffDTO(specialization);
            var existingStaff = CreateSampleStaff(specialization);

            _staffMapperMock.Setup(m => m.ToDomain(dto)).Returns(existingStaff);
            _staffRepositoryMock.Setup(r => r.GetByEmailAsync(existingStaff.Email)).ReturnsAsync((Staff)null);
            _staffRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(existingStaff.PhoneNumber)).ReturnsAsync(existingStaff);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.CreateStaffAsync(dto));

            _staffMapperMock.Verify(m => m.ToDomain(dto), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByEmailAsync(existingStaff.Email), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(existingStaff.PhoneNumber), Times.Once);
            _specializationRepositoryMock.Verify(r => r.GetByIdAsync(existingStaff.SpecializationId), Times.Never);
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

            _staffMapperMock.Setup(m => m.ToDomain(dto)).Returns(existingStaff);
            _staffRepositoryMock.Setup(r => r.GetByEmailAsync(existingStaff.Email)).ReturnsAsync((Staff)null);
            _staffRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(existingStaff.PhoneNumber)).ReturnsAsync((Staff)null);
            _specializationRepositoryMock.Setup(s => s.GetByIdAsync(specialization.Id)).ReturnsAsync((Specialization)null);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.CreateStaffAsync(dto));

            _staffMapperMock.Verify(m => m.ToDomain(dto), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByEmailAsync(existingStaff.Email), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(existingStaff.PhoneNumber), Times.Once);
            _specializationRepositoryMock.Verify(r => r.GetByIdAsync(existingStaff.SpecializationId), Times.Once);
            _staffRepositoryMock.Verify(r => r.AddAsync(existingStaff), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }

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
            _staffMapperMock.Setup(m => m.ToDto(existingStaff))
                .Returns(new StaffDTO
                {
                    Id = existingStaff.Id.AsGuid(),
                    FirstName = existingStaff.FirstName,
                    LastName = existingStaff.LastName,
                    FullName = existingStaff.FullName,
                    LicenseNumber = existingStaff.LicenseNumber.ToString(),
                    Email = existingStaff.Email,
                    PhoneNumber = existingStaff.PhoneNumber,
                    AvailabilitySlots = existingStaff.AvailabilitySlots.Select(date => date.ToString()).ToArray(),
                    SpecializationId = existingStaff.SpecializationId,
                    IsActive = false
                }
                );

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
            Assert.Equal(existingStaff.SpecializationId, result.SpecializationId);
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
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.DeactivateStaffAsync(staffId));

            _staffRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<StaffId>()), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }

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
                AddAvailabilitySlots = "2024-11-10 14:00,2024-11-11 09:00",
                RemoveAvailabilitySlots = "2024-11-09 10:00",
                SpecializationId = newspecialization.Id.ToString()
            };

            string message = "Staff updated. The following fields were updated: Phone Number, Added Availability Slots, Removed Availability Slots, Specialization.";
            var log = new Log(TypeOfAction.Update, existingStaff.Id.ToString(), message);

            _staffRepositoryMock.Setup(r => r.GetByIdAsync(existingStaff.Id)).ReturnsAsync(existingStaff);
            _staffRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(dto.PhoneNumber)).ReturnsAsync((Staff)null);
            _specializationRepositoryMock.Setup(s => s.GetByIdAsync(newspecialization.Id)).ReturnsAsync(newspecialization);
            _logRepositoryMock.Setup(l => l.AddAsync(It.IsAny<Log>())).ReturnsAsync(log);


            var addSlots = dto.AddAvailabilitySlots.Split(',')
                            .Select(slot => DateTime.Parse(slot.Trim()))
                            .ToArray();

            _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns(new StaffDTO
            {
                Id = existingStaff.Id.AsGuid(),
                FirstName = existingStaff.FirstName,
                LastName = existingStaff.LastName,
                FullName = existingStaff.FullName,
                LicenseNumber = existingStaff.LicenseNumber.ToString(),
                Email = existingStaff.Email,
                PhoneNumber = dto.PhoneNumber,
                AvailabilitySlots = addSlots.Select(date => date.ToString()).ToArray(),
                SpecializationId = newspecialization.Id,
                IsActive = existingStaff.IsActive
            });

            // Act
            var result = await _service.UpdateStaffAsync(staffId, dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.PhoneNumber, result.PhoneNumber);
            Assert.Equal(addSlots.Select(date => date.ToString()).ToArray(), result.AvailabilitySlots);
            Assert.Equal(dto.SpecializationId, result.SpecializationId.ToString());

            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateStaffAsync_WhenSpecializationIsInvalid_ShouldThrowBusinessRuleValidationException()
        {
            // Arrange
            var specialization = CreateSampleSpecialization();
            var existingStaff = CreateSampleStaff(specialization);
            var staffId = existingStaff.Id.AsGuid();

            var dto = new UpdateStaffDTO
            {
                SpecializationId = Guid.NewGuid().ToString()
            };

            // Mock para buscar staff existente
            _staffRepositoryMock.Setup(r => r.GetByIdAsync(existingStaff.Id)).ReturnsAsync(existingStaff);

            // Mock para simular que a especialização não existe
            _specializationRepositoryMock.Setup(s => s.GetByIdAsync(It.IsAny<SpecializationId>())).ReturnsAsync((Specialization)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateStaffAsync(staffId, dto));
            Assert.Equal("Id of Specialization does not exist.", exception.Message);

            // Verifica que o commit não foi chamado
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }

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
            _staffMapperMock.Setup(m => m.ToDto(It.IsAny<Staff>())).Returns((Staff staff) => new StaffDTO
            {
                Id = staff.Id.AsGuid(),
                FirstName = staff.FirstName,
                LastName = staff.LastName,
                FullName = staff.FullName,
                LicenseNumber = staff.LicenseNumber.ToString(),
                Email = staff.Email,
                PhoneNumber = staff.PhoneNumber,
                SpecializationId = staff.SpecializationId,
                AvailabilitySlots = staff.AvailabilitySlots.Select(s => s.ToString()).ToArray(),
                IsActive = staff.IsActive
            });

            // Act
            var result = await _service.SearchStaffProfiles(searchDto);

            // Assert
            Assert.NotNull(result);
            Assert.All(result, staff => Assert.Contains("Sofia", staff.FirstName));
            _staffRepositoryMock.Verify(r => r.SearchStaffAsync(searchDto), Times.Once);
        }



    }
}
