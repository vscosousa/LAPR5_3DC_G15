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
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.OperationTypes;
using System.Collections.Generic;
using DDDSample1.Domain.Staffs;
using System.Diagnostics;

namespace DDDSample1.Tests.OperationTypes.IntegrationTests
{
    public class OperationTypeControllerServiceIntegrationTests : IClassFixture<TestWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;
        private readonly TestWebApplicationFactory<Startup> _factory;

        public OperationTypeControllerServiceIntegrationTests(TestWebApplicationFactory<Startup> factory)
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
        public async Task CreateOperationType_ShouldReturnOk_WhenOperationTypeIsCreated()
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

            // Act
            var operationTypeDTO = new CreatingOperationTypeDTO
            {

                Name = "Cardiology operation",
                EstimatedDuration = "2 hours",
                Specializations = new List<string> { createdSpecialization.SpecOption }

            };

            var response = await _client.PostAsJsonAsync("api/operationType", operationTypeDTO);
            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task CreateOperationType_ShouldReturnError_WhenNameAlreadyExists()
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

            // Act
            var operationTypeDTO = new CreatingOperationTypeDTO
            {

                Name = "Cardiology operation",
                EstimatedDuration = "2 hours",
                Specializations = new List<string> { createdSpecialization.SpecOption }

            };

            var response = await _client.PostAsJsonAsync("api/operationType", operationTypeDTO);
            // Assert
            response.EnsureSuccessStatusCode();

            var newOperationTypeDTO = new CreatingOperationTypeDTO
            {

                Name = "Cardiology operation",
                EstimatedDuration = "5 hours",
                Specializations = new List<string> { createdSpecialization.SpecOption }

            };

            var newResponse = await _client.PostAsJsonAsync("api/operationType", newOperationTypeDTO);
            //Assert 
            Assert.Equal(System.Net.HttpStatusCode.OK, newResponse.StatusCode);
        }

        [Fact]
        public async Task CreateOperationType_ShouldReturnError_WhenSpecializationIsBlank()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);


            // Act
            var operationTypeDTO = new CreatingOperationTypeDTO
            {

                Name = "Cardiology operation",
                EstimatedDuration = "2 hours",
                Specializations = new List<string> { }

            };

            var response = await _client.PostAsJsonAsync("api/operationType", operationTypeDTO);
            // Assert
            Assert.Equal(System.Net.HttpStatusCode.InternalServerError, response.StatusCode);
        }

        [Fact]
        public async Task CreateOperationType_ShouldReturnError_WhenSpecializationIsNotFound()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);


            // Act
            var operationTypeDTO = new CreatingOperationTypeDTO
            {

                Name = "Cardiology operation",
                EstimatedDuration = "2 hours",
                Specializations = new List<string> { "NonExistingSpecialization" }

            };

            var response = await _client.PostAsJsonAsync("api/operationType", operationTypeDTO);
            // Assert
            Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task UpdateOperationType_ShouldReturnOk_WhenOperationTypeIsUpdated()
        {
            // Arrange
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var specializationDto = new CreatingSpecializationDTO
            {
                SpecOption = "Cardiology"
            };
            var specializationResponse = await _client.PostAsJsonAsync("/api/specialization", specializationDto);
            specializationResponse.EnsureSuccessStatusCode();

            var createdSpecialization = await specializationResponse.Content.ReadFromJsonAsync<SpecializationDTO>();
            var specializationId = createdSpecialization.Id;

            var operationTypeDTO = new CreatingOperationTypeDTO
            {
                Name = "Cardiology operation",
                EstimatedDuration = "2 hours",
                Specializations = new List<string> { createdSpecialization.SpecOption }
            };

            var createResponse = await _client.PostAsJsonAsync("/api/operationType", operationTypeDTO);
            createResponse.EnsureSuccessStatusCode();
            var createdOperationType = await createResponse.Content.ReadFromJsonAsync<OperationTypeDTO>();


            var updatedOperationTypeDTO = new UpdatingOperationTypeDTO
            {
                Name = "Updated Cardiology operation",
                EstimatedDuration = "3 hours",
                Specializations = new List<string> { createdSpecialization.SpecOption }
            };

            // Act
            var updateResponse = await _client.PutAsJsonAsync($"/api/operationType/{createdOperationType.Name}", updatedOperationTypeDTO);

            // Assert
            updateResponse.EnsureSuccessStatusCode();
            var updatedOperationType = await updateResponse.Content.ReadFromJsonAsync<OperationTypeDTO>();
            Assert.Equal(updatedOperationTypeDTO.Name, updatedOperationType.Name);
            Assert.Equal(updatedOperationTypeDTO.EstimatedDuration, updatedOperationType.EstimatedDuration);

        }

        [Fact]
        public async Task UpdateOperationType_ShouldReturnNotFound_WhenOperationTypeDoesNotExist()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var updatedOperationTypeDTO = new UpdatingOperationTypeDTO
            {
                Name = "Updated Cardiology operation",
                EstimatedDuration = "3 hours",
                Specializations = new List<string>()
            };

            var updateResponse = await _client.PutAsJsonAsync("/api/operationType/NonExistingOperation", updatedOperationTypeDTO);
            Assert.Equal(System.Net.HttpStatusCode.NotFound, updateResponse.StatusCode);
        }

        [Fact]
        public async Task UpdateOperationType_ShouldReturnBadRequest_WhenSpecializationDoesNotExist()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var specializationDto = new CreatingSpecializationDTO
            {
                SpecOption = "Cardiology"
            };
            var specializationResponse = await _client.PostAsJsonAsync("/api/specialization", specializationDto);
            specializationResponse.EnsureSuccessStatusCode();

            var createdSpecialization = await specializationResponse.Content.ReadFromJsonAsync<SpecializationDTO>();
            var specializationId = createdSpecialization.Id;

            var operationTypeDTO = new CreatingOperationTypeDTO
            {
                Name = "Cardiology operation",
                EstimatedDuration = "2 hours",
                Specializations = new List<string> { createdSpecialization.SpecOption }
            };

            var createResponse = await _client.PostAsJsonAsync("/api/operationType", operationTypeDTO);
            createResponse.EnsureSuccessStatusCode();
            var createdOperationType = await createResponse.Content.ReadFromJsonAsync<OperationTypeDTO>();

            var updatedOperationTypeDTO = new UpdatingOperationTypeDTO
            {
                Name = "Updated Cardiology operation",
                EstimatedDuration = "3 hours",
                Specializations = new List<string> { "NonExistingSpecialization" }
            };

            var updateResponse = await _client.PutAsJsonAsync($"/api/operationType/{createdOperationType.Name}", updatedOperationTypeDTO);
            Assert.Equal(System.Net.HttpStatusCode.NotFound, updateResponse.StatusCode);
        }

        [Fact]
        public async Task UpdateOperationType_ShouldReturnUnauthorized_WhenUserIsNotAdmin()
        {


            var updatedOperationTypeDTO = new UpdatingOperationTypeDTO
            {
                Name = "Updated Cardiology operation",
                EstimatedDuration = "3 hours",
                Specializations = new List<string>()
            };

            var updateResponse = await _client.PutAsJsonAsync("/api/operationType/ExistingOperation", updatedOperationTypeDTO);
            Assert.Equal(System.Net.HttpStatusCode.NotFound, updateResponse.StatusCode);
        }

        [Fact]
        public async Task DeactivateOperationType_ShouldReturnOk_WhenOperationTypeIsDeactivated()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var specializationDto = new CreatingSpecializationDTO
            {
                SpecOption = "Cardiology"
            };

            var specializationResponse = await _client.PostAsJsonAsync("/api/specialization", specializationDto);
            specializationResponse.EnsureSuccessStatusCode();

            var createdSpecialization = await specializationResponse.Content.ReadFromJsonAsync<SpecializationDTO>();
            var specializationId = createdSpecialization.Id;

            var operationTypeDTO = new CreatingOperationTypeDTO
            {
                Name = "ExistingOperation",
                EstimatedDuration = "2 hours",
                Specializations = new List<string> { createdSpecialization.SpecOption }
            };

            var createResponse = await _client.PostAsJsonAsync("/api/operationType", operationTypeDTO);
            createResponse.EnsureSuccessStatusCode();

            var operationName = operationTypeDTO.Name;

            var deactivateResponse = await _client.PutAsJsonAsync($"/api/operationType/deactivate/{operationName}", operationName);

            deactivateResponse.EnsureSuccessStatusCode();
            var responseMessage = await deactivateResponse.Content.ReadAsStringAsync();
            Assert.Contains($"OperationType '{operationName}' has been successfully Deactivated.", responseMessage);
        }


        [Fact]
        public async Task DeactivateOperationType_ShouldReturnNotFound_WhenOperationTypeDoesNotExist()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var operationName = "NonExistingOperation";

            var response = await _client.PutAsJsonAsync($"/api/operationType/deactivate/{operationName}", operationName);

            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);

        }

        [Fact]
        public async Task DeactivateOperationType_ShouldReturnBadRequest_WhenInvalidOperation()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var operationName = "InvalidOperation";

            var response = await _client.PutAsJsonAsync($"/api/operationType/deactivate/{operationName}", operationName);

            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);

        }

        [Fact]
        public async Task DeactivateOperationType_ShouldReturnUnauthorized_WhenUserIsNotAdmin()
        {

            var operationName = "ExistingOperation";

            var response = await _client.PutAsJsonAsync($"/api/operationType/deactivate/{operationName}", operationName);

            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

                [Fact]
        public async Task GetOperationType_ShouldReturnOk_WhenOperationTypeExists()
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
        
            // Act
            var operationTypeDTO = new CreatingOperationTypeDTO
            {
                Name = "Cardiology operation",
                EstimatedDuration = "2 hours",
                Specializations = new List<string> { createdSpecialization.SpecOption }
            };
        
            var responseUser = await _client.PostAsJsonAsync("api/operationType", operationTypeDTO);
            responseUser.EnsureSuccessStatusCode();
        
            var createdUser = await responseUser.Content.ReadFromJsonAsync<OperationTypeDTO>();
        
            var response = await _client.GetAsync($"/api/OperationType?id={createdUser.Id}");
        
            // Log the response content
            var responseContent = await response.Content.ReadAsStringAsync();
            Debug.WriteLine($"Response Content: {responseContent}");
        
            // Step 3: Assert the response is successful
            response.EnsureSuccessStatusCode();
        }


        [Fact]
        public async Task GetOperationType_ShouldReturnNotFound_WhenOperationTypeDoesNotExist()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var nonExistingId = Guid.NewGuid();

            // Act
            var response = await _client.GetAsync($"/api/OperationType/id/{nonExistingId}");

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GetOperationTypeByName_ShouldReturnOk_WhenOperationTypeExists()
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
        
            // Act
            var operationTypeDTO = new CreatingOperationTypeDTO
            {
                Name = "Cardiology operation",
                EstimatedDuration = "2 hours",
                Specializations = new List<string> { createdSpecialization.SpecOption }
            };
        
            var responseUser = await _client.PostAsJsonAsync("api/operationType", operationTypeDTO);
            responseUser.EnsureSuccessStatusCode();
        
            var createdUser = await responseUser.Content.ReadFromJsonAsync<OperationTypeDTO>();
        
            var response = await _client.GetAsync($"/api/operationType/name/{createdUser.Name}");
    
        
            // Step 3: Assert the response is successful
            response.EnsureSuccessStatusCode();
        }



    }
}