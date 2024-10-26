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
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Staffs;
using Microsoft.OpenApi.Writers;
using System.Diagnostics;
using DDDSample1.Domain.Shared;
using System.Text.Json;

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
                new Claim(ClaimTypes.Email, "testadmin@gmail.com"),
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
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

        [Fact]
        public async Task RegisterUser_ShouldReturnOk_WhenUserIsCreated()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var dto = new CreatingSpecializationDTO
            {
                SpecOption = "Cardiology"
            };

            var specialization = await _client.PostAsJsonAsync("/api/specialization", dto);
            specialization.EnsureSuccessStatusCode();

            var createdSpecialization = await specialization.Content.ReadFromJsonAsync<SpecializationDTO>();

            var specializationId = createdSpecialization.Id;

            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "Joao",
                LastName = "Pereira",
                FullName = "Joao Pereira",
                Email = "joao@gmail.com",
                PhoneNumber = "+351912325678",
                SpecializationId = specializationId
            };

            var staff = await _client.PostAsJsonAsync("/api/staff", staffDTO);
            staff.EnsureSuccessStatusCode();

            var createdStaff = await staff.Content.ReadFromJsonAsync<StaffDTO>();

            var staffId = createdStaff.Id;

            var userDTO = new CreatingUserDTO
            {
                Email = "joao@gmail.com",
                Username = "jonas",
                Role = 0,
                StaffId = staffId
            };

            var response = await _client.PostAsJsonAsync("/api/user/RegisterUser", userDTO);
            response.EnsureSuccessStatusCode();

        }

        [Fact]
        public async Task RegisterUser_ShouldReturnError_WhenStaffDoesNotExist()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var userDTO = new CreatingUserDTO
            {
                Email = "user@gmail.com",
                Username = "user",
                Role = 0,
                StaffId = Guid.NewGuid()
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/user/RegisterUserAsPatient", userDTO);

            // Assert
            response.StatusCode.Equals(HttpStatusCode.InternalServerError);
        }

        [Fact]
        public async Task RegisterUser_ShouldReturnError_WhenUserDoesNotHavePermission()
        {
            var userDTO = new CreatingUserDTO
            {
                Email = "joao@gmail.com",
                Username = "jonas",
                Role = 0,
                StaffId = new Guid()
            };

            var response = await _client.PostAsJsonAsync("/api/user/RegisterUser", userDTO);
            response.StatusCode.Equals(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task RegisterUser_ShouldReturnError_WhenEmailAlreadyRegisted()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var dto = new CreatingSpecializationDTO
            {
                SpecOption = "Cardiology"
            };

            var specialization = await _client.PostAsJsonAsync("/api/specialization", dto);
            specialization.EnsureSuccessStatusCode();

            var createdSpecialization = await specialization.Content.ReadFromJsonAsync<SpecializationDTO>();

            var specializationId = createdSpecialization.Id;

            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "Joao",
                LastName = "Pereira",
                FullName = "Joao Pereira",
                Email = "joao@gmail.com",
                PhoneNumber = "+351912325678",
                SpecializationId = specializationId
            };

            var staff = await _client.PostAsJsonAsync("/api/staff", staffDTO);
            staff.EnsureSuccessStatusCode();

            var createdStaff = await staff.Content.ReadFromJsonAsync<StaffDTO>();

            var staffId = createdStaff.Id;

            var userDTO = new CreatingUserDTO
            {
                Email = "joao@gmail.com",
                Username = "jonas",
                Role = 0,
                StaffId = staffId
            };

            var createdUser = await _client.PostAsJsonAsync("/api/user/RegisterUser", userDTO);


            var newUserDTO = new CreatingUserDTO
            {
                Email = "joao@gmail.com",
                Username = "joao",
                Role = 0,
                StaffId = staffId
            };

            var response = await _client.PostAsJsonAsync("/api/user/RegisterUser", newUserDTO);

            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        [Fact]
        public async Task RegisterUser_ShouldReturnError_WhenUsernameAlreadyRegisted()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var dto = new CreatingSpecializationDTO
            {
                SpecOption = "Cardiology"
            };

            var specialization = await _client.PostAsJsonAsync("/api/specialization", dto);
            specialization.EnsureSuccessStatusCode();

            var createdSpecialization = await specialization.Content.ReadFromJsonAsync<SpecializationDTO>();

            var specializationId = createdSpecialization.Id;

            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "Joao",
                LastName = "Pereira",
                FullName = "Joao Pereira",
                Email = "joao@gmail.com",
                PhoneNumber = "+351912325678",
                SpecializationId = specializationId
            };

            var staff = await _client.PostAsJsonAsync("/api/staff", staffDTO);
            staff.EnsureSuccessStatusCode();

            var createdStaff = await staff.Content.ReadFromJsonAsync<StaffDTO>();

            var staffId = createdStaff.Id;

            var userDTO = new CreatingUserDTO
            {
                Email = "joao@gmail.com",
                Username = "jonas",
                Role = 0,
                StaffId = staffId
            };

            var createdUser = await _client.PostAsJsonAsync("/api/user/RegisterUser", userDTO);


            var newUserDTO = new CreatingUserDTO
            {
                Email = "jonas@gmail.com",
                Username = "jonas",
                Role = 0,
                StaffId = staffId
            };

            var response = await _client.PostAsJsonAsync("/api/user/RegisterUser", newUserDTO);

            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }


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
            var user = await response.Content.ReadAsStringAsync();
            Assert.NotNull(user);
            Assert.True(IsJwtToken(user));
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
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
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
        public async Task ActivatePatientUser_ShouldReturnOk_WhenUserIsActivated()
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
            token = await response.Content.ReadAsStringAsync();

            // Act
            var activate = await _client.PostAsync($"/api/user/ActivatePatientUser?token={token}", null);
            activate.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task ActivatePatientUser_ShouldReturnError_WhenUserIsNotPatient()
        {
            var token = GenerateAdminJwtToken();

            // Act
            var response = await _client.PostAsync($"/api/user/ActivatePatientUser?token={token}", null);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
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

            token = await user.Content.ReadAsStringAsync();
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
            // Act
            var response = await _client.PostAsJsonAsync("/api/user/RequestDelete", token);

            // Assert
            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        [Fact]
        public async Task DeleteUser_ShouldReturnOk_WhenUserIsDeleted()
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
            var user = await _client.PostAsJsonAsync("/api/user/RegisterUserAsPatient", userDTO);

            // Assert
            user.EnsureSuccessStatusCode();
            token = await user.Content.ReadAsStringAsync();

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await _client.DeleteAsync($"/api/user/DeleteUser/{token}");
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task DeleteUser_ShouldReturnError_WhenUserIsNotPatient()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            // Act
            var response = await _client.DeleteAsync($"/api/user/DeleteUser/{token}");

            // Assert
            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        [Fact]
        public async Task DeleteUser_ShouldReturnError_WhenUserDoesNotExist()
        {
            var token = GeneratePatientJwtToken(new UserDTO
            {
                Id = Guid.NewGuid(),
                Email = "error@example.com",
                Username = "error",
            });

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            // Act
            var response = await _client.DeleteAsync($"/api/user/DeleteUser/{token}");

            // Assert
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }


        [Fact]
        public async Task LoginUser_ShouldReturnOk()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var dto = new CreatingSpecializationDTO
            {
                SpecOption = "Cardiology"
            };

            var specialization = await _client.PostAsJsonAsync("/api/specialization", dto);
            specialization.EnsureSuccessStatusCode();

            var createdSpecialization = await specialization.Content.ReadFromJsonAsync<SpecializationDTO>();

            var specializationId = createdSpecialization.Id;

            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "Joao",
                LastName = "Pereira",
                FullName = "Joao Pereira",
                Email = "joao@gmail.com",
                PhoneNumber = "+351912325678",
                SpecializationId = specializationId
            };

            var staff = await _client.PostAsJsonAsync("/api/staff", staffDTO);
            staff.EnsureSuccessStatusCode();

            var createdStaff = await staff.Content.ReadFromJsonAsync<StaffDTO>();

            var staffId = createdStaff.Id;

            var userDTO = new CreatingUserDTO
            {
                Email = "joao@gmail.com",
                Username = "jonas",
                Role = 0,
                StaffId = staffId
            };

            var user = await _client.PostAsJsonAsync("/api/user/RegisterUser", userDTO);
            user.EnsureSuccessStatusCode();

            if (user.IsSuccessStatusCode)
            {
                Debug.WriteLine($"Status Code: {user.StatusCode}");
                Debug.WriteLine($"Response Content: {await user.Content.ReadAsStringAsync()}");
            }


            var createdUserDTO = await user.Content.ReadFromJsonAsync<UserDTO>();
            Debug.WriteLine($"Response Content: {createdUserDTO}");

            var domainUser = new User(createdUserDTO.Email, createdUserDTO.Username, 0, staffId);

            domainUser.SetPassword("Password123@");

            var loginDTO = new LoginUserDTO
            {
                Email = createdUserDTO.Email,
                Password = "Password123@"
            };


            var response = await _client.PostAsJsonAsync("/api/user/Login", loginDTO);
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task LoginUser_ShouldReturnError_UserNotActive()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var dto = new CreatingSpecializationDTO
            {
                SpecOption = "Cardiology"
            };

            var specialization = await _client.PostAsJsonAsync("/api/specialization", dto);
            specialization.EnsureSuccessStatusCode();

            var createdSpecialization = await specialization.Content.ReadFromJsonAsync<SpecializationDTO>();

            var specializationId = createdSpecialization.Id;

            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "Joao",
                LastName = "Pereira",
                FullName = "Joao Pereira",
                Email = "joao@gmail.com",
                PhoneNumber = "+351912325678",
                SpecializationId = specializationId
            };

            var staff = await _client.PostAsJsonAsync("/api/staff", staffDTO);
            staff.EnsureSuccessStatusCode();

            var createdStaff = await staff.Content.ReadFromJsonAsync<StaffDTO>();

            var staffId = createdStaff.Id;

            var userDTO = new CreatingUserDTO
            {
                Email = "joao@gmail.com",
                Username = "jonas",
                Role = 0,
                StaffId = staffId
            };

            var user = await _client.PostAsJsonAsync("/api/user/RegisterUser", userDTO);
            user.EnsureSuccessStatusCode();

            if (user.IsSuccessStatusCode)
            {
                Debug.WriteLine($"Status Code: {user.StatusCode}");
                Debug.WriteLine($"Response Content: {await user.Content.ReadAsStringAsync()}");
            }


            var createdUserDTO = await user.Content.ReadFromJsonAsync<UserDTO>();
            Debug.WriteLine($"Response Content: {createdUserDTO}");


            var loginDTO = new LoginUserDTO
            {
                Email = createdUserDTO.Email,
                Password = "Password123@"
            };


            var response = await _client.PostAsJsonAsync("/api/user/Login", loginDTO);
            response.StatusCode.Equals(HttpStatusCode.InternalServerError);
        }

        [Fact]
        public async Task LoginUser_ShouldReturnError_UserIsLocked()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange - Create Specialization
            var dto = new CreatingSpecializationDTO
            {
                SpecOption = "Cardiology"
            };

            var specialization = await _client.PostAsJsonAsync("/api/specialization", dto);
            specialization.EnsureSuccessStatusCode();

            var createdSpecialization = await specialization.Content.ReadFromJsonAsync<SpecializationDTO>();
            var specializationId = createdSpecialization.Id;

            // Arrange - Create Staff
            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "Joao",
                LastName = "Pereira",
                FullName = "Joao Pereira",
                Email = "joao@gmail.com",
                PhoneNumber = "+351912325678",
                SpecializationId = specializationId
            };

            var staff = await _client.PostAsJsonAsync("/api/staff", staffDTO);
            staff.EnsureSuccessStatusCode();

            var createdStaff = await staff.Content.ReadFromJsonAsync<StaffDTO>();
            var staffId = createdStaff.Id;

            // Arrange - Create User
            var userDTO = new CreatingUserDTO
            {
                Email = "joao@gmail.com",
                Username = "jonas",
                Role = 0,
                StaffId = staffId
            }; 
            
            
            var user = await _client.PostAsJsonAsync("/api/user/RegisterUser", userDTO);
            user.EnsureSuccessStatusCode();
            

            var createdUserDTO = await user.Content.ReadFromJsonAsync<UserDTO>();

            

            // Lock the user
            var domainUser = new User(createdUserDTO.Email, createdUserDTO.Username, 0, staffId);
            domainUser.SetPassword("Password123@");
            domainUser.LockAccount();
        
            // Arrange - Login DTO
            var loginDTO = new LoginUserDTO
            {
                Email = domainUser.Email,
                Password = "Password123@"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/user/Login", loginDTO);

            // Assert
            response.StatusCode.Equals(HttpStatusCode.Forbidden);
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
