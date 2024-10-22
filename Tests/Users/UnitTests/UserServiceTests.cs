using System;
using System.Threading.Tasks;
using Moq;
using Xunit;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using Microsoft.Extensions.Configuration;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Logs;

namespace DDDSample1.Tests.Users.UnitTests
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMailService> _mailServiceMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IUserMapper> _userMapperMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly Mock<ILogRepository> _logRepositoryMock;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _mailServiceMock = new Mock<IMailService>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _userMapperMock = new Mock<IUserMapper>();
            _configurationMock = new Mock<IConfiguration>();
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _logRepositoryMock = new Mock<ILogRepository>();

           
            _configurationMock.Setup(config => config["Jwt:Key"])
                              .Returns("your-very-secure-key-that-is-at-least-256-bits-long");

           
            _userService = new UserService(
                _userRepositoryMock.Object,
                _mailServiceMock.Object,
                _unitOfWorkMock.Object,
                _configurationMock.Object,
                _patientRepositoryMock.Object,
                _logRepositoryMock.Object,
                _userMapperMock.Object
            );
        }

        [Fact]
        public async Task CreateUser_SuccessfullyCreatesUser()
        {

            var dto = new CreatingUserDTO("joaopereira@gmail.com", "joao.pereira", 0);
            var user = new User(dto.Email, dto.Username, Role.Admin);


            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync((User)null);
            _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(dto.Username))
                               .ReturnsAsync((User)null);


            _userMapperMock.Setup(mapper => mapper.ToDomain(dto))
                           .Returns(user);


            _userRepositoryMock.Setup(repo => repo.AddAsync(user)).ReturnsAsync(user);


            var createdUser = await _userService.CreateUser(dto);

            // Assert
            Assert.NotNull(createdUser);
            Assert.Equal(dto.Email, createdUser.Email);
            Assert.Equal(dto.Username, createdUser.Username);
            Assert.Equal(Role.Admin, createdUser.Role);
            Assert.False(createdUser.IsActive);
        }
    

    [Fact]
        public async Task CreateUser_EmailIsAlreadyInUse()
        {
            var dto = new CreatingUserDTO
            {
                Email = "admin@gmail.com",
                Username = "testuser"
            };

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                .ReturnsAsync(new User("admin@gmail.com", "admin", Role.Admin)); 

            var exception = await Assert.ThrowsAsync<Exception>(() => _userService.CreateUser(dto));
            Assert.Equal("Email is already in use.", exception.Message);
        }

        [Fact]
        public async Task CreateUser_UsernameIsAlreadyInUse()
        {
            
            var dto = new CreatingUserDTO
            {
                Email = "test@example.com",
                Username = "admin"
            };

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                .ReturnsAsync((User)null);
            _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(dto.Username))
                .ReturnsAsync(new User("admin@gmail.com", "admin", Role.Admin)); 
            
            var exception = await Assert.ThrowsAsync<Exception>(() => _userService.CreateUser(dto));
            Assert.Equal("Username is already in use.", exception.Message);
        }
    }
}

