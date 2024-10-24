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