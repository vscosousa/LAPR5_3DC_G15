using System.Threading.Tasks;
using DDDSample1.Domain.Logs;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace DDDSample1.Tests.Users.UnitTests
{
    public class UserServiceTests
    {


        private readonly UserService _service;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMailService> _mailServiceMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly Mock<ILogRepository> _logRepositoryMock;

        public UserServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _mailServiceMock = new Mock<IMailService>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _configurationMock = new Mock<IConfiguration>();
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _logRepositoryMock = new Mock<ILogRepository>();

            _service = new UserService(
                _userRepositoryMock.Object,
                _mailServiceMock.Object,
                _unitOfWorkMock.Object,
                _configurationMock.Object,
                _patientRepositoryMock.Object,
                _logRepositoryMock.Object
            );
        }


        // Teste 1 - Testar a criação de um utilizador BACKOFFICE USER com sucesso
        /* [Fact]
        public async Task CreateBackofficeUserSuccessfullyTest()
        {
            // Arrange: Create the DTO and expected user object
            var dto = new CreatingUserDTO(
                "joaopereira@gmail.com",
                "joao.pereira",
                "Admin"
            );

            var expectedUser = new User(
                "joaopereira@gmail.com",
                "joao.pereira",
                Role.Admin
            );

            // Mock the user repository methods
            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync((User)null);
            _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(dto.Username))
                               .ReturnsAsync((User)null);
            _userRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<User>()))
                               .ReturnsAsync(expectedUser);

            _mailServiceMock.Setup(mail => mail.SendEmail(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                            .Returns(Task.CompletedTask);

            // Act: Call the method to create the user
            var createdUser = await _service.CreateUser(dto);

            // Assert: Verify the user was created successfully
            Assert.NotNull(createdUser);
            Assert.Equal(expectedUser.Email, createdUser.Email);
            Assert.Equal(expectedUser.Username, createdUser.Username);
            Assert.Equal(expectedUser.Role, createdUser.Role);
            Assert.False(createdUser.IsActive); // User is not active yet

            // Verify that the email was sent
            _mailServiceMock.Verify(mail => mail.SendEmail(dto.Email, "Activate your account", It.IsAny<string>()), Times.Once);
        } */


    }
}