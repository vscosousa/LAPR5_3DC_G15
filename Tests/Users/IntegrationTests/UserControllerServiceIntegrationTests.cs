using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Xunit;
using System.Text;
using System.Net.Http;
using DDDSample1;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Users;
using System.Net;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using DDDSample1.Domain.Patients;
using System.Collections.Generic;

namespace DDDSample1.Tests.Users.IntegrationTests
{

    [Collection("Integration Collection")]
    public class UserControllerServiceIntegrationTests : IClassFixture<TestWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;
        private readonly TestWebApplicationFactory<Startup> _factory;


        public UserControllerServiceIntegrationTests(TestWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
            _factory.ResetDatabase();
        }

        private string GenerateAdminJwtToken()
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, "testadmin"),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_factory.Services.GetService<IConfiguration>()["Jwt:Key"]));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: cred
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private string GeneratePatientJwtToken(UserDTO user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, "Patient")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_factory.Services.GetService<IConfiguration>()["Jwt:Key"]));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: cred
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private string GenerateActivationJwtToken()
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_factory.Services.GetService<IConfiguration>()["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.Email, "testuser@example.com"),
                new Claim(ClaimTypes.Name, "testuser"),
                new Claim(ClaimTypes.Role, "Admin")
            }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /*[Fact]
        public async Task RegisterUser_ShouldReturnOk_WhenUserIsCreated()
        {
            // Arrange
            var userDTO = new CreatingUserDTO
            {
                Email = "testuser@example.com",
                Username = "testuser",
                Role = 0
            };

                var token = GenerateAdminJwtToken();
                _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                // Act
                var response = await _client.PostAsJsonAsync("/api/user/RegisterUser", userDTO);

                // Assert
                response.EnsureSuccessStatusCode();
                var user = await response.Content.ReadFromJsonAsync<User>();
                Assert.NotNull(user);
                Assert.Equal(userDTO.Email, user.Email);
                Assert.Equal(userDTO.Username, user.Username);
            }

            [Fact]
            public async Task RegisterUser_ShouldReturnConflict_WhenEmailIsAlreadyInUse()
            {
                // Arrange
                var existingUserDTO = new CreatingUserDTO
                {
                    Email = "testuser2@example.com",
                    Username = "existinguser2",
                    Role = 0
                };

                var token = GenerateAdminJwtToken();
                _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                // create user with the same email
                var createResponse = await _client.PostAsJsonAsync("/api/user/RegisterUser", existingUserDTO);
                Assert.True(createResponse.IsSuccessStatusCode);

            var newUserDTO = new CreatingUserDTO
            {
                Email = "testuser@example.com", 
                Username = "newuser",
                Role = 0,
            };


                var conflictResponse = await _client.PostAsJsonAsync("/api/user/RegisterUser", newUserDTO);

                // assert
                Assert.Equal(HttpStatusCode.Conflict, conflictResponse.StatusCode);
            }


            [Fact]
            public async Task RegisterUser_ShouldReturnConflict_WhenUsernameIsAlreadyInUse()
            {
                // Arrange
                var existingUserDTO = new CreatingUserDTO
                {
                    Email = "testuser3@example.com",
                    Username = "existinguser",
                    Role = 0
                };

                var token = GenerateAdminJwtToken();
                _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                // create user with the same username
                var createResponse = await _client.PostAsJsonAsync("/api/user/RegisterUser", existingUserDTO);
                Assert.True(createResponse.IsSuccessStatusCode);

                var newUserDTO = new CreatingUserDTO
                {
                    Email = "test3@example.com",
                    Username = "existinguser",
                    Role = 0,
                };


                var conflictResponse = await _client.PostAsJsonAsync("/api/user/RegisterUser", newUserDTO);

                // assert
                Assert.Equal(HttpStatusCode.Conflict, conflictResponse.StatusCode);
            }

            [Fact]
            public async Task ActivateUser_ShouldReturnOk()
            {
                // Arrange
                var userDTO = new CreatingUserDTO
                {
                    Email = "testuser@example.com",
                    Username = "testuser",
                    Role = 0
                };

                // Use admin token for registering the user
                var adminToken = GenerateAdminJwtToken(); // Admin token for authorization
                _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);

                // Create user
                var createResponse = await _client.PostAsJsonAsync("/api/user/RegisterUser", userDTO);
                createResponse.EnsureSuccessStatusCode();

                // Simulate the generation of an activation token (e.g., as if sent via email)
                var activationToken = GenerateActivationJwtToken(); // Token used for activating the user

                // Activate the user
                var newPassword = "Password123@";
                var activateUserDTO = new { Token = activationToken, NewPassword = newPassword };

                var response = await _client.PostAsJsonAsync("/api/user/Activate", activateUserDTO);

                // Assert
                response.EnsureSuccessStatusCode();
                var activatedUser = await response.Content.ReadFromJsonAsync<User>();
                Assert.NotNull(activatedUser);
                Assert.Equal(userDTO.Email, activatedUser.Email);
                Assert.Equal(userDTO.Username, activatedUser.Username);
                Assert.True(activatedUser.IsActive);
            }*/

        [Fact]
        public async Task RegisterPatientUser_ShouldReturnOk_WhenUserIsCreated()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var dto = new CreatingPatientDTO
            {
                FirstName = "Ana",
                LastName = "Salvador",
                FullName = "Ana Salvador",
                DateOfBirth = "1990/05/15",
                GenderOptions = GenderOptions.Female,
                Email = "ana.salvador@gmail.com",
                PhoneNumber = "+351123456789",
                EmergencyContact = "+351987654321",
                MedicalConditions = "Nenhuma"
            };

            // Arrange
            var patient = await _client.PostAsJsonAsync("/api/patient", dto);
            patient.EnsureSuccessStatusCode();

            var createdPatient = await patient.Content.ReadFromJsonAsync<PatientDTO>();

            var patientId = createdPatient.Id;
            var userDTO = new CreatingPatientUserDTO
            {
                Email = "ana.salvador@gmail.com",
                Password = "Password123@",
                PhoneNumber = "+351123456789",
                PatientId = patientId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/user/RegisterUserAsPatient", userDTO);

            // Assert
            response.EnsureSuccessStatusCode();
            var user = await response.Content.ReadFromJsonAsync<UserDTO>();
            Assert.NotNull(user);
            Assert.Equal(userDTO.Email, user.Email);
            Assert.Equal(userDTO.Email, user.Username);
        }

        [Fact]
        public async Task RegisterPatientUser_ShouldReturnConflict_WhenEmailIsAlreadyInUse()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var dto = new CreatingPatientDTO
            {
                FirstName = "Ana",
                LastName = "Salvador",
                FullName = "Ana Salvador",
                DateOfBirth = "1990/05/15",
                GenderOptions = GenderOptions.Female,
                Email = "ana.salvador@gmail.com",
                PhoneNumber = "+351123456789",
                EmergencyContact = "+351987654321",
                MedicalConditions = "Nenhuma"
            };

            // Arrange
            var patient = await _client.PostAsJsonAsync("/api/patient", dto);
            patient.EnsureSuccessStatusCode();

            var createdPatient = await patient.Content.ReadFromJsonAsync<PatientDTO>();

            var patientId = createdPatient.Id;
            var userDTO = new CreatingPatientUserDTO
            {
                Email = "ana.salvador@gmail.com",
                Password = "Password123@",
                PhoneNumber = "+351123456789",
                PatientId = patientId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/user/RegisterUserAsPatient", userDTO);
            response.EnsureSuccessStatusCode();

            var response2 = await _client.PostAsJsonAsync("/api/user/RegisterUserAsPatient", userDTO);

            // Assert
            Assert.Equal(HttpStatusCode.InternalServerError, response2.StatusCode);
        }

        [Fact]
        public async Task RegisterPatientUser_ShouldReturnError_WhenPatientDoesNotExist()
        {
            var userDTO = new CreatingPatientUserDTO
            {
                Email = "ana.salvador@gmail.com",
                Password = "Password123@",
                PhoneNumber = "+351123456789",
                PatientId = Guid.NewGuid()
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/user/RegisterUserAsPatient", userDTO);

            // Assert
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        [Fact]
        public async Task RegisterPatientUser_ShouldReturnError_WhenPhoneNumberDoesNotMatch()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var dto = new CreatingPatientDTO
            {
                FirstName = "Ana",
                LastName = "Salvador",
                FullName = "Ana Salvador",
                DateOfBirth = "1990/05/15",
                GenderOptions = GenderOptions.Female,
                Email = "ana.salvador@gmail.com",
                PhoneNumber = "+351123456789",
                EmergencyContact = "+351987654321",
                MedicalConditions = "Nenhuma"
            };

            // Arrange
            var patient = await _client.PostAsJsonAsync("/api/patient", dto);
            patient.EnsureSuccessStatusCode();

            var createdPatient = await patient.Content.ReadFromJsonAsync<PatientDTO>();

            var patientId = createdPatient.Id;
            var userDTO = new CreatingPatientUserDTO
            {
                Email = "ana.salvador@gmail.com",
                Password = "Password123@",
                PhoneNumber = "+351123456245",
                PatientId = patientId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/user/RegisterUserAsPatient", userDTO);

            // Assert
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        [Fact]
        public async Task RequestDeleteUser_ShouldReturnOk_WhenRequestIsMade()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
            var dto = new CreatingPatientDTO
            {
                FirstName = "Ana",
                LastName = "Salvador",
                FullName = "Ana Salvador",
                DateOfBirth = "1990/05/15",
                GenderOptions = GenderOptions.Female,
                Email = "ana.salvador@gmail.com",
                PhoneNumber = "+351123456789",
                EmergencyContact = "+351987654321",
                MedicalConditions = "Nenhuma"
            };
        
            // Arrange
            var patient = await _client.PostAsJsonAsync("/api/patient", dto);
            patient.EnsureSuccessStatusCode();
        
            var createdPatient = await patient.Content.ReadFromJsonAsync<PatientDTO>();
        
            var patientId = createdPatient.Id;
            var userDTO = new CreatingPatientUserDTO
            {
                Email = "ana.salvador@gmail.com",
                Password = "Password123@",
                PhoneNumber = "+351123456789",
                PatientId = patientId
            };
        
            var user = await _client.PostAsJsonAsync("/api/user/RegisterUserAsPatient", userDTO);
            user.EnsureSuccessStatusCode();
        
            var userDto = await user.Content.ReadFromJsonAsync<UserDTO>();
            token = GeneratePatientJwtToken(userDto);
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
            // Act
            var response = await _client.PostAsJsonAsync("/api/user/RequestDelete", token);
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task RequestDeleteUser_ShouldReturnError_WhenUserIsNotPatient()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
            var dto = new CreatingPatientDTO
            {
                FirstName = "Ana",
                LastName = "Salvador",
                FullName = "Ana Salvador",
                DateOfBirth = "1990/05/15",
                GenderOptions = GenderOptions.Female,
                Email = "ana.salvador@gmail.com",
                PhoneNumber = "+351123456789",
                EmergencyContact = "+351987654321",
                MedicalConditions = "Nenhuma"
            };
        
            // Arrange
            var patient = await _client.PostAsJsonAsync("/api/patient", dto);
            patient.EnsureSuccessStatusCode();
        
            var createdPatient = await patient.Content.ReadFromJsonAsync<PatientDTO>();
        
            var patientId = createdPatient.Id;
            var userDTO = new CreatingPatientUserDTO
            {
                Email = "ana.salvador@gmail.com",
                Password = "Password123@",
                PhoneNumber = "+351123456789",
                PatientId = patientId
            };
        
            var user = await _client.PostAsJsonAsync("/api/user/RegisterUserAsPatient", userDTO);
            user.EnsureSuccessStatusCode();
        
            var userDto = await user.Content.ReadFromJsonAsync<UserDTO>();
            token = GeneratePatientJwtToken(userDto);
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
            // Act
            var response = await _client.PostAsJsonAsync("/api/user/RequestDelete", token);
            response.EnsureSuccessStatusCode();
        }
    }
}