using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net.Http.Json;
using DDDSample1.Domain.Patients;
using System.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace DDDSample1.Tests.Patients.IntegrationTests
{
    public class PatientControllerServiceIntegrationTests : IClassFixture<TestWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;
        private readonly TestWebApplicationFactory<Startup> _factory;

        public PatientControllerServiceIntegrationTests(TestWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
            _factory.ResetDatabase();
        }

        private string GenerateAdminJwtToken()
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_factory.Services.GetService<IConfiguration>()["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
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
        public async Task CreatePatient_ShouldReturnOk_WhenPatientIsCreated()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var patientDTO = new CreatingPatientDTO
            {
                FirstName = "João",
                LastName = "Silva",
                FullName = "João Silva",
                DateOfBirth = "1990/01/01",
                GenderOptions = GenderOptions.Male,
                Email = "joao.silva@example.com",
                PhoneNumber = "+351912345678",
                EmergencyContact = "+351912345678",
                MedicalConditions = "Nenhuma"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/Patient", patientDTO);

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task CreatePatient_ShouldReturnError_WhenPatientAlreadyExists()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var patientDTO = new CreatingPatientDTO
            {
                FirstName = "João",
                LastName = "Silva",
                FullName = "João Silva",
                DateOfBirth = "1990/01/01",
                GenderOptions = GenderOptions.Male,
                Email = "joao.silva@example.com",
                PhoneNumber = "+351912345678",
                EmergencyContact = "+351912345678",
                MedicalConditions = "Nenhuma"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/Patient", patientDTO);

            // Assert
            response.EnsureSuccessStatusCode();

            // Act
            var response2 = await _client.PostAsJsonAsync("/api/Patient", patientDTO);

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.BadRequest, response2.StatusCode);
        }

        [Fact]
        public async Task DeletePatient_ShouldReturnOk_WhenPatientIsDeleted()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var patientDTO = new CreatingPatientDTO
            {
                FirstName = "João",
                LastName = "Silva",
                FullName = "João Silva",
                DateOfBirth = "1990/01/01",
                GenderOptions = GenderOptions.Male,
                Email = "joao.silva@example.com",
                PhoneNumber = "+351912345678",
                EmergencyContact = "+351912345678",
                MedicalConditions = "Nenhuma"
            };

            // Act
            var createResponse = await _client.PostAsJsonAsync("/api/Patient", patientDTO);

            // Assert
            createResponse.EnsureSuccessStatusCode();

            var createdPatient = await createResponse.Content.ReadFromJsonAsync<PatientDTO>();

            // Act
            var response = await _client.DeleteAsync($"/api/Patient/{createdPatient.Id}");

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task DeletePatient_ShouldReturnNotFound_WhenPatientDoesNotExist()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await _client.DeleteAsync($"/api/Patient/{Guid.NewGuid()}");

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task UpdatePatient_ShouldReturnOk_WhenPatientIsUpdated()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var patientDTO = new CreatingPatientDTO
            {
                FirstName = "João",
                LastName = "Silva",
                FullName = "João Silva",
                DateOfBirth = "1990/01/01",
                GenderOptions = GenderOptions.Male,
                Email = "joao.silva@example.com",
                PhoneNumber = "+351912345678",
                EmergencyContact = "+351912345678",
                MedicalConditions = "Nenhuma"
            };

            var createResponse = await _client.PostAsJsonAsync("/api/Patient", patientDTO);
            createResponse.EnsureSuccessStatusCode();
            var createdPatient = await createResponse.Content.ReadFromJsonAsync<PatientDTO>();

            var updatePatientDTO = new UpdatePatientDTO
            {
                FirstName = "João Updated",
                LastName = "Silva Updated",
                FullName = "João Silva Updated",
                Email = "joao.silva.updated@example.com",
                PhoneNumber = "+351912345679",
                EmergencyContact = "+351912345679",
                MedicalConditions = "Updated Condition"
            };

            // Act
            var response = await _client.PutAsJsonAsync($"/api/Patient/{createdPatient.Id}", updatePatientDTO);

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task UpdatePatient_ShouldReturnNotFound_WhenPatientDoesNotExist()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var updatePatientDTO = new UpdatePatientDTO
            {
                FirstName = "João Updated",
                LastName = "Silva Updated",
                FullName = "João Silva Updated",
                Email = "joao.silva.updated@example.com",
                PhoneNumber = "+351912345679",
                EmergencyContact = "+351912345679",
                MedicalConditions = "Updated Condition"
            };

            // Act
            var response = await _client.PutAsJsonAsync($"/api/Patient/{Guid.NewGuid()}", updatePatientDTO);

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GetPatient_ShouldReturnOk_WhenPatientExists()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var patientDTO = new CreatingPatientDTO
            {
                FirstName = "João",
                LastName = "Silva",
                FullName = "João Silva",
                DateOfBirth = "1990/01/01",
                GenderOptions = GenderOptions.Male,
                Email = "joao.silva@example.com",
                PhoneNumber = "+351912345678",
                EmergencyContact = "+351912345678",
                MedicalConditions = "Nenhuma"
            };

            var createResponse = await _client.PostAsJsonAsync("/api/Patient", patientDTO);
            createResponse.EnsureSuccessStatusCode();

            // Act
            var response = await _client.GetAsync($"/api/Patient");

            // Assert
            response.EnsureSuccessStatusCode();

            var patients = await response.Content.ReadFromJsonAsync<PatientDTO[]>();
            Assert.NotEmpty(patients);
            Assert.Contains(patients, p => p.Email == patientDTO.Email);

        }

        [Fact]
        public async Task GetPatient_ShouldReturnNotFound_WhenPatientDoesNotExist()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await _client.GetAsync($"/api/Patient/");

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}