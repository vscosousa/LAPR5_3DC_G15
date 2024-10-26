using System;
using System.Threading.Tasks;
using Moq;
using Xunit;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using Microsoft.Extensions.Configuration;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Logs;
using Microsoft.IdentityModel.Tokens;
using DDDSample1.Domain.Staffs;
using System.IdentityModel.Tokens.Jwt;
using DDDSample1.Domain.Specializations;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http.HttpResults;

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
        private readonly Mock<IStaffRepository> _staffRepositoryMock;

        public UserServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _mailServiceMock = new Mock<IMailService>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _userMapperMock = new Mock<IUserMapper>();
            _configurationMock = new Mock<IConfiguration>();
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _logRepositoryMock = new Mock<ILogRepository>();
            _staffRepositoryMock = new Mock<IStaffRepository>();


            _configurationMock.Setup(config => config["Jwt:Key"])
                              .Returns("your-very-secure-key-that-is-at-least-256-bits-long");


            _userService = new UserService(
                _userRepositoryMock.Object,
                _mailServiceMock.Object,
                _unitOfWorkMock.Object,
                _configurationMock.Object,
                _patientRepositoryMock.Object,
                _staffRepositoryMock.Object,
                _logRepositoryMock.Object,
                _userMapperMock.Object
            );
        }

        private Staff CreateSampleStaff()
        {
            var specialization = new Specialization("Cardiology");
            return new Staff(
            "João",
            "Pereira",
            "João Pereira",
            "joao.pereira@gmail.com",
            "+123456789",
            specialization.Id
            );
        }

        private Patient createSamplePatient()
        {
            return new Patient(
                "João",
                "Pereira",
                "João Pereira",
                new DateOnly(1999, 12, 25),
                GenderOptions.Male,
                "joao.pereira@gmail.com",
                "+123456789",
                "+987654321",
                "Medical Conditions"
            );
        }

        //Unit Test for CreateUser - US5.1.1
        [Fact]
        public async Task CreateUser_SuccessfullyCreatesUser()
        {

            var staff = CreateSampleStaff();
            var dto = new CreatingUserDTO(staff.Email, "joao.pereira", 0, staff.Id.AsGuid());
            var user = new User(dto.Email, dto.Username, dto.Role, dto.StaffId);

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync((User)null);
            _staffRepositoryMock.Setup(repo => repo.GetByEmailAsync(dto.Email))
                               .ReturnsAsync(staff);
            _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(dto.Username))
                               .ReturnsAsync((User)null);


            _userMapperMock.Setup(mapper => mapper.ToDomain(dto))
                           .Returns(user);

            _userMapperMock.Setup(mapper => mapper.ToDto(user))
                           .Returns(new UserDTO(user.Id.AsGuid(), user.Email, user.Username, user.IsActive));


            _userRepositoryMock.Setup(repo => repo.AddAsync(user)).ReturnsAsync(user);


            var createdUser = await _userService.CreateUser(dto);

            // Assert
            Assert.NotNull(createdUser);
            Assert.Equal(dto.Email, createdUser.Email);
            Assert.Equal(dto.Username, createdUser.Username);
            Assert.False(createdUser.IsActive);
        }

        //Unit Test for CreateUser - US5.1.1
        [Fact]
        public async Task CreateUser_EmailIsAlreadyInUse()
        {
            var staff = CreateSampleStaff();
            var dto = new CreatingUserDTO
            {
                Email = "admin@gmail.com",
                Username = "testuser"
            };

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                .ReturnsAsync(new User("admin@gmail.com", "admin", Role.Admin, staff.Id.AsGuid()));

            var exception = await Assert.ThrowsAsync<Exception>(() => _userService.CreateUser(dto));
            Assert.Equal("Email is already in use.", exception.Message);
        }

        //Unit Test for CreateUser - US5.1.1
        [Fact]
        public async Task CreateUser_UsernameIsAlreadyInUse()
        {
            var staff = CreateSampleStaff();

            var dto = new CreatingUserDTO
            {
                Email = staff.Email,
                Username = "admin",
                Role = 0,
                StaffId = staff.Id.AsGuid()
            };

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                .ReturnsAsync((User)null);
            _staffRepositoryMock.Setup(repo => repo.GetByEmailAsync(dto.Email))
                               .ReturnsAsync(staff);
            _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(dto.Username))
                .ReturnsAsync(new User(dto.Email, dto.Username, dto.Role, dto.StaffId));

            var exception = await Assert.ThrowsAsync<Exception>(() => _userService.CreateUser(dto));
            Assert.Equal("Username is already in use.", exception.Message);
        }

        //Unit Test for ActivateUser - US5.1.1
        [Fact]
        public async Task ActivateUser_ExpiredToken()
        {
            // Arrange
            var staff = CreateSampleStaff();
            var userId = Guid.NewGuid();
            var expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hbWFpZGVudGlmaWVyIjoic2VjdXJpdHkiLCJleHBhbml0eSI6MTcyOTYwNjIwMn0.9n-Z0lRhhg2I5D_vgh0ECjfjE1lQAWYw3He3Q9cS1to"; // Example of an expired token
            var newPassword = "newPassword123";
            var user = new User("user@example.com", "username", Role.Admin, staff.Id.AsGuid());

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(new UserID(userId))).ReturnsAsync(user);


            _configurationMock.SetupGet(c => c["Jwt:Key"]).Returns("your-very-secure-key-that-is-at-least-256-bits-long");


            var exception = await Assert.ThrowsAsync<SecurityTokenException>(() => _userService.ActivateUser(expiredToken, newPassword));
            Assert.Contains("Token validation failed", exception.Message);
        }

        //Unit Test for ActivateUser - US5.1.1
        [Fact]
        public async Task ActivateUser_InvalidPassword()
        {
            var staff = CreateSampleStaff();
            var dto = new CreatingUserDTO("joaopereira@gmail.com", "joao.pereira", 0, staff.Id.AsGuid());
            var user = new User(dto.Email, dto.Username, Role.Admin, dto.StaffId);
            var token = _userService.CreateToken(user);

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync((User)null);
            _staffRepositoryMock.Setup(repo => repo.GetByEmailAsync(dto.Email))
                               .ReturnsAsync(staff);
            _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(dto.Username))
                               .ReturnsAsync((User)null);


            _userMapperMock.Setup(mapper => mapper.ToDomain(dto))
                           .Returns(user);


            _userRepositoryMock.Setup(repo => repo.AddAsync(user)).ReturnsAsync(user);

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(user.Id)).ReturnsAsync(user);


            var createdUser = await _userService.CreateUser(dto);

            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _userService.ActivateUser(token, "aaaa"));
            Assert.Contains("Password must be at least 10 characters long, include at least one digit, one uppercase letter, and one special character.", exception.Message);
        }

        //Unit Test for ActivateUser - US5.1.1
        [Fact]
        public async Task ActivateUser_SuccessfullyActivatesUser()
        {
            // Arrange
            var staff = CreateSampleStaff();
            var dto = new CreatingUserDTO("joaopereira@gmail.com", "joao.pereira", 0, staff.Id.AsGuid());
            var user = new User(dto.Email, dto.Username, Role.Admin, dto.StaffId);
            var token = _userService.CreateToken(user);

            var expectedDto = new UserDTO(user.Id.AsGuid(), user.Email, user.Username, true);

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync((User)null);
            _staffRepositoryMock.Setup(repo => repo.GetByEmailAsync(dto.Email))
                               .ReturnsAsync(staff);
            _userRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(dto.Username))
                               .ReturnsAsync((User)null);

            _userMapperMock.Setup(mapper => mapper.ToDomain(dto))
                           .Returns(user);

            _userRepositoryMock.Setup(repo => repo.AddAsync(user)).ReturnsAsync(user);
            _userMapperMock.Setup(mapper => mapper.ToDto(user))
                                    .Returns(expectedDto);


            // Act
            var createdUser = await _userService.CreateUser(dto);

            _userRepositoryMock.Setup(repo => repo.UpdateAsync(user)).Returns(Task.CompletedTask);
            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(user.Id)).ReturnsAsync(user);

            var activatedUserDto = await _userService.ActivateUser(token, "PasswordCorrect123@");

            // Assert
            Assert.NotNull(activatedUserDto);
            Assert.True(activatedUserDto.IsActive);
            Assert.Equal(user.Email, activatedUserDto.Email);
            Assert.Equal(user.Username, activatedUserDto.Username);
        }

        //Unit Test for Login - US5.1.6
        [Fact]
        public async Task Login_EmailNotRegistered_ThrowsException()
        {
            var dto = new LoginUserDTO { Email = "nonexistent@example.com", Password = "password123" };

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync((User)null);


            var exception = await Assert.ThrowsAsync<Exception>(() => _userService.Login(dto));
            Assert.Equal("Email not registered", exception.Message);
        }

        //Unit Test for Login - US5.1.6
        [Fact]
        public async Task Login_UserNotActive()
        {

            var staff = CreateSampleStaff();
            var dto = new LoginUserDTO { Email = "inactive@example.com", Password = "password123" };
            var user = new User(dto.Email, "username", Role.Admin, staff.Id.AsGuid());

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync(user);


            var result = await _userService.Login(dto);


            Assert.Equal("User is not active. Check your Email to activate the account.", result);
        }

        //Unit Test for Login - US5.1.6
        [Fact]
        public async Task Login_UserLocked_ReturnsAccountLockedMessage()
        {

            var staff = CreateSampleStaff();
            var dto = new LoginUserDTO { Email = "locked@example.com", Password = "password123" };
            var user = new User(dto.Email, "username", Role.Admin, staff.Id.AsGuid());
            user.Activate();
            user.LockAccount();

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync(user);


            var result = await _userService.Login(dto);


            Assert.Equal($"Your account is locked until {user.LockedUntil.Value.ToLocalTime()}. Please try again later.", result);
        }

        //Unit Test for Login - US5.1.6
        [Fact]
        public async Task Login_WrongPassword_RegistersFailedAttempt()
        {

            var staff = CreateSampleStaff();
            var dto = new LoginUserDTO { Email = "wrongpassword@example.com", Password = "wrongPassword" };
            var user = new User(dto.Email, "username", Role.Admin, staff.Id.AsGuid());
            user.Activate();
            user.SetPassword("CorrectPassword1@");
            user.RegisterFailedLoginAttempt();

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync(user);
            _userRepositoryMock.Setup(repo => repo.UpdateAsync(user))
                               .Returns(Task.CompletedTask);



            var result = await _userService.Login(dto);


            Assert.Equal($"Wrong password. You have {5 - user.FailedLoginAttempts} attempts left before your account is locked.", result);
            _userRepositoryMock.Verify(repo => repo.UpdateAsync(user), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        //Unit Test for Login - US5.1.6
        [Fact]
        public async Task Login_UserLockedAfterFailedAttempts_NotifiesAdmin()
        {
            var staff = CreateSampleStaff();
            var dto = new LoginUserDTO { Email = "lockafterattempts@example.com", Password = "wrongPassword" };
            var user = new User(dto.Email, "username", Role.Admin, staff.Id.AsGuid());
            user.Activate();
            user.SetPassword("CorrectPassword1@");
            user.RegisterFailedLoginAttempt();
            user.RegisterFailedLoginAttempt();
            user.RegisterFailedLoginAttempt();
            user.RegisterFailedLoginAttempt();

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync(user);
            _userRepositoryMock.Setup(repo => repo.UpdateAsync(user))
                               .Returns(Task.CompletedTask);

            _mailServiceMock.Setup(mail => mail.SendEmailToAdminAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                            .Returns(Task.CompletedTask);


            var result = await _userService.Login(dto);


            Assert.Equal("Your account has been locked due to multiple failed login attempts. Please try again in 30 minutes. An admin has been notified.", result);
        }

        //Unit Test for Login - US5.1.6
        [Fact]
        public async Task Login_SuccessfulLogin()
        {

            var dto = new LoginUserDTO { Email = "success@example.com", Password = "PasswordCorrect123@" };
            var staff = CreateSampleStaff();
            var user = new User(dto.Email, "username", Role.Admin, staff.Id.AsGuid());
            user.Activate();
            user.SetPassword(dto.Password);

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync(user);
            _userRepositoryMock.Setup(repo => repo.UpdateAsync(user))
                               .Returns(Task.CompletedTask);


            _userRepositoryMock.Setup(repo => repo.UpdateAsync(user)).Returns(Task.CompletedTask);


            var result = await _userService.Login(dto);


            Assert.NotNull(result);
            Assert.True(IsJwtToken(result));
        }

        //Unit Test for Registering a new Patient User - US5.1.3
        [Fact]
        public async Task CreatePatientUser_SuccessfullyCreatesPatientUser()
        {

            var patient = createSamplePatient();
            var dto = new CreatingPatientUserDTO(patient.Email, "PasswordCorrect123@", "+123456789", patient.Id.AsGuid());
            var user = new User(patient.Email, dto.Password, dto.PhoneNumber, patient.Id.AsGuid());

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync((User)null);

            _patientRepositoryMock.Setup(repo => repo.GetByEmailAsync(dto.Email))
                               .ReturnsAsync(patient);

            _userMapperMock.Setup(mapper => mapper.ToCreatingPatientUser(dto))
                           .Returns(user);

            _userRepositoryMock.Setup(repo => repo.AddAsync(user)).ReturnsAsync(user);


            var createdUser = await _userService.CreateUserAsPatient(dto);

            // Assert
            Assert.NotNull(createdUser);
            Assert.True(IsJwtToken(createdUser));
        }

        //Unit Test for Registering a new Patient User - US5.1.3
        [Fact]
        public async Task RegisterPatientUser_EmailIsAlreadyInUse()
        {
            var patient = createSamplePatient();
            var user = new User(patient.Email, "PasswordCorrect123@", patient.PhoneNumber, patient.Id.AsGuid());
            var dto = new CreatingPatientUserDTO("joao.pereira@gmail.com", "PasswordCorrect123@", "+123456789", patient.Id.AsGuid());

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                               .ReturnsAsync(new User(dto.Email, dto.Password, dto.PhoneNumber, dto.PatientId));

            var exception = await Assert.ThrowsAsync<Exception>(() => _userService.CreateUserAsPatient(dto));

            Assert.Equal("Email is already in use.", exception.Message);
            _userRepositoryMock.Verify(repo => repo.GetUserByEmailAsync(dto.Email), Times.Once);
            _patientRepositoryMock.Verify(repo => repo.GetByEmailAsync(dto.Email), Times.Never);
            _userRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<User>()), Times.Never);
            _userMapperMock.Verify(mapper => mapper.ToCreatingPatientUser(dto), Times.Never);
        }

        //Unit Test for Registering a new Patient User - US5.1.3
        [Fact]
        public async Task RegisterPatientUser_PhoneNumberDoesNotMatchPatient()
        {
            var patient = createSamplePatient();
            var user = new User(patient.Email, "PasswordCorrect123@", patient.PhoneNumber, patient.Id.AsGuid());
            var dto = new CreatingPatientUserDTO("joao.pereira@gmail.com", "PasswordCorrect123@", "+123489", patient.Id.AsGuid());

            _userRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
                                .ReturnsAsync((User)null);
            _patientRepositoryMock.Setup(repo => repo.GetByEmailAsync(dto.Email))
                                .ReturnsAsync(patient);

            var exception = await Assert.ThrowsAsync<Exception>(() => _userService.CreateUserAsPatient(dto));

            Assert.Equal("Phone number does not match the Patient's profile with the given email.", exception.Message);
            _userRepositoryMock.Verify(repo => repo.GetUserByEmailAsync(dto.Email), Times.Once);
            _patientRepositoryMock.Verify(repo => repo.GetByEmailAsync(dto.Email), Times.Once);
            _userRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<User>()), Times.Never);
            _userMapperMock.Verify(mapper => mapper.ToCreatingPatientUser(dto), Times.Never);
        }

        //Unit Test for ActivatePatientUser - US5.1.3
        [Fact]
        public async Task ActivatePatientUser_SuccessfullyActivatesPatientUser()
        {
            // Arrange
            var patient = createSamplePatient();
            var dto = new CreatingPatientUserDTO("joao.pereira@gmail.com", "PasswordCorrect123@", "+123489", patient.Id.AsGuid());
            var user = new User(patient.Email, "PasswordCorrect123@", patient.PhoneNumber, patient.Id.AsGuid());
            var token = _userService.CreateToken(user);

            var expectedDto = new UserDTO(user.Id.AsGuid(), user.Email, user.Username, true);

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(user.Id)).ReturnsAsync(user);
            _patientRepositoryMock.Setup(repo => repo.GetByEmailAsync(user.Email)).ReturnsAsync(patient);
            _userRepositoryMock.Setup(repo => repo.UpdateAsync(user)).Returns(Task.CompletedTask);
            _userMapperMock.Setup(mapper => mapper.ToDto(user))
                                    .Returns(expectedDto);

            var activatedUserDto = await _userService.ActivateUserAsPatient(token);

            // Assert
            Assert.NotNull(activatedUserDto);
            Assert.True(activatedUserDto.IsActive);
            Assert.Equal(user.Email, activatedUserDto.Email);
            Assert.Equal(user.Username, activatedUserDto.Username);
        }

        [Fact]
        public async Task ActivatePatientUser_ExpiredToken()
        {
            // Arrange
            var patient = createSamplePatient();
            var dto = new CreatingPatientUserDTO("joao.pereira@gmail.com", "PasswordCorrect123@", "+123489", patient.Id.AsGuid());
            var user = new User(patient.Email, "PasswordCorrect123@", patient.PhoneNumber, patient.Id.AsGuid());
            var token = _userService.CreateToken(user);
            var expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hbWFpZGVudGlmaWVyIjoic2VjdXJpdHkiLCJleHBhbml0eSI6MTcyOTYwNjIwMn0.9n-Z0lRhhg2I5D_vgh0ECjfjE1lQAWYw3He3Q9cS1to";

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(new UserID(user.Id.AsGuid()))).ReturnsAsync(user);
            _configurationMock.SetupGet(c => c["Jwt:Key"]).Returns("your-very-secure-key-that-is-at-least-256-bits-long");
            var exception = await Assert.ThrowsAsync<SecurityTokenException>(() => _userService.ActivateUserAsPatient(expiredToken));
            Assert.Contains("Token validation failed", exception.Message);
        }


        [Fact]
        public async Task ActivatePatientUser_UserNotFound()
        {
            // Arrange
            var patient = createSamplePatient();
            var dto = new CreatingPatientUserDTO("joao.pereira@gmail.com", "PasswordCorrect123@", "+123489", patient.Id.AsGuid());
            var user = new User(patient.Email, "PasswordCorrect123@", patient.PhoneNumber, patient.Id.AsGuid());
            var token = _userService.CreateToken(user);

            var expectedDto = new UserDTO(user.Id.AsGuid(), user.Email, user.Username, true);

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(user.Id)).ReturnsAsync((User)null);

            var nullResponse = await _userService.ActivateUserAsPatient(token);

            Assert.Null(nullResponse);
        }

        [Fact]
        public async Task RequestDeletePatientUser_Successfully()
        {
            // Arrange
            var patient = createSamplePatient();
            var user = new User(patient.Email, "PasswordCorrect123@", patient.PhoneNumber, patient.Id.AsGuid());
            var token = _userService.CreateToken(user);

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(user.Id)).ReturnsAsync(user);
            _mailServiceMock.Setup(mail => mail.SendEmail(user.Email, "Delete User Request", It.IsAny<string>())).Returns(Task.CompletedTask);
            
            // Act
            await _userService.RequestDelete(token);

            // Assert
            _userRepositoryMock.Verify(repo => repo.GetByIdAsync(user.Id), Times.Once);
            _mailServiceMock.Verify(mail => mail.SendEmail(user.Email, "Delete User Request", It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task RequestDeletePatientUser_UserNotFound()
        {
            // Arrange
            var patient = createSamplePatient();
            var user = new User(patient.Email, "PasswordCorrect123@", patient.PhoneNumber, patient.Id.AsGuid());
            var token = _userService.CreateToken(user);

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(user.Id)).ReturnsAsync((User)null);
            
            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _userService.RequestDelete(token));

            // Assert
            Assert.Equal("User not found.", exception.Message);
            _userRepositoryMock.Verify(repo => repo.GetByIdAsync(user.Id), Times.Once);
            _mailServiceMock.Verify(mail => mail.SendEmail(user.Email, "Delete User Request", It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task DeletePatientUser_Successfully()
        {
            // Arrange
            var patient = createSamplePatient();
            var user = new User(patient.Email, "PasswordCorrect123@", patient.PhoneNumber, patient.Id.AsGuid());
            var token = _userService.CreateToken(user);

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(user.Id)).ReturnsAsync(user);
            _userRepositoryMock.Setup(repo => repo.Remove(user));
            _logRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Log>())).ReturnsAsync(new Log(TypeOfAction.Delete, user.Id.ToString(), "User of Type: " + user.Role.ToString() + "was deleted."));
            // Act
            await _userService.DeleteUser(token);

            // Assert
            _userRepositoryMock.Verify(repo => repo.GetByIdAsync(user.Id), Times.Once);
            _userRepositoryMock.Verify(repo => repo.Remove(user), Times.Once);
            _logRepositoryMock.Verify(repo => repo.AddAsync(It.Is<Log>(log => log.TypeOfAction == TypeOfAction.Delete && log.Message.Contains("User of Type: " + user.Role.ToString() + "was deleted."))), Times.Once);
        }

        [Fact]
        public async Task DeletePatientUser_TokenExpired()
        {
            // Arrange
            var patient = createSamplePatient();
            var user = new User(patient.Email, "PasswordCorrect123@", patient.PhoneNumber, patient.Id.AsGuid());
            var token = _userService.CreateToken(user);
            var expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hbWFpZGVudGlmaWVyIjoic2VjdXJpdHkiLCJleHBhbml0eSI6MTcyOTYwNjIwMn0.9n-Z0lRhhg2I5D_vgh0ECjfjE1lQAWYw3He3Q9cS1to";

            _configurationMock.SetupGet(c => c["Jwt:Key"]).Returns("your-very-secure-key-that-is-at-least-256-bits-long");
            var exception = await Assert.ThrowsAsync<SecurityTokenException>(() => _userService.ActivateUserAsPatient(expiredToken));
            Assert.Contains("Token validation failed", exception.Message);
        }

        private bool IsJwtToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                return false;

            var parts = token.Split('.');
            if (parts.Length != 3)
                return false;

            try
            {
                var header = Base64UrlDecode(parts[0]);
                var payload = Base64UrlDecode(parts[1]);

                // Check if header and payload are valid JSON
                var headerJson = JsonDocument.Parse(header);
                var payloadJson = JsonDocument.Parse(payload);

                return true;
            }
            catch
            {
                return false;
            }
        }

        private string Base64UrlDecode(string input)
        {
            var output = input.Replace('-', '+').Replace('_', '/');
            switch (output.Length % 4)
            {
                case 0: break;
                case 2: output += "=="; break;
                case 3: output += "="; break;
                default: throw new ArgumentException("Illegal base64url string!", nameof(input));
            }
            var converted = Convert.FromBase64String(output);
            return Encoding.UTF8.GetString(converted);
        }
    }
}


