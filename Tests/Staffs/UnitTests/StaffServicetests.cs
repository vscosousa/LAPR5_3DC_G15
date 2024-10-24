using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Shared;
using Moq;
using Xunit;
using DDDSample1.Domain.Logs;

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

        // Test for Creating a New Staff (POST)
        [Fact]
        public async Task CreateStaffAsynSuccessfullyTest()
        {
            // Arrange
            var specialization = new Specialization("Specialization");
            var dto = new CreatingStaffDTO("Teste", "Afonso", "Teste Afonso", "teste@gmail.com", "+351932392503", specialization.Id.ToString());
            var expectedStaff = new Staff("Teste", "Afonso", "Teste Afonso", "teste@gmail.com", "+351932392503", specialization.Id);
            
            _staffMapperMock.Setup(m => m.ToDomain(dto)).Returns(expectedStaff);
            _staffRepositoryMock.Setup(r => r.GetByEmailAsync(expectedStaff.Email)).ReturnsAsync((Staff)null);
            _staffRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(expectedStaff.PhoneNumber)).ReturnsAsync((Staff)null);
            _specializationRepositoryMock.Setup(r => r.GetByIdAsync(expectedStaff.SpecializationId)).ReturnsAsync(specialization);
            _staffRepositoryMock.Setup(r => r.AddAsync(expectedStaff)).ReturnsAsync(expectedStaff);

            // Act
            var createdStaff = await _service.CreateStaffAsync(dto);
            
            // Assert
            Assert.NotNull(createdStaff);
            Assert.IsType<Staff>(createdStaff);

            Assert.Equal(expectedStaff.FirstName, createdStaff.FirstName);
            Assert.Equal(expectedStaff.LastName, createdStaff.LastName);
            Assert.Equal(expectedStaff.FullName, createdStaff.FullName);
            Assert.Equal(expectedStaff.LicenseNumber, createdStaff.LicenseNumber);
            Assert.Equal(expectedStaff.Email, createdStaff.Email);
            Assert.Equal(expectedStaff.PhoneNumber, createdStaff.PhoneNumber);
            Assert.Equal(expectedStaff.AvailabilitySlots, createdStaff.AvailabilitySlots);
            Assert.Equal(expectedStaff.SpecializationId, createdStaff.SpecializationId);

            _staffMapperMock.Verify(m => m.ToDomain(dto), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByEmailAsync(expectedStaff.Email), Times.Once);
            _staffRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(expectedStaff.PhoneNumber), Times.Once);
            _specializationRepositoryMock.Verify(r => r.GetByIdAsync(expectedStaff.SpecializationId), Times.Once);
            _staffRepositoryMock.Verify(r => r.AddAsync(expectedStaff), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateStaffFailsDueToDuplicateEmailTest()
        {
            // Arrange
            var specialization = new Specialization("Specialization");
            var dto = new CreatingStaffDTO("Teste", "Afonso", "Teste Afonso", "teste@gmail.com", "+351932392503", specialization.Id.ToString());
            var existingStaff = new Staff("Teste", "Afonso", "Teste Afonso", "teste@gmail.com", "+351932392503", specialization.Id);

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
            var specialization = new Specialization("Specialization");
            var dto = new CreatingStaffDTO("Teste", "Afonso", "Teste Afonso", "teste@gmail.com", "+351932392503", specialization.Id.ToString());
            var existingStaff = new Staff("Teste", "Afonso", "Teste Afonso", "teste@gmail.com", "+351932392503", specialization.Id);

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
            var specialization = new Specialization("Specialization");
            var dto = new CreatingStaffDTO("Teste", "Afonso", "Teste Afonso", "teste@gmail.com", "+351932392503", specialization.Id.ToString());
            var existingStaff = new Staff("Teste", "Afonso", "Teste Afonso", "teste@gmail.com", "+351932392503", specialization.Id);

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

    }
}
