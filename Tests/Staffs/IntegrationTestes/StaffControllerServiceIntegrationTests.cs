using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net.Http.Json;
using DDDSample1.Domain.Staffs;
using System.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using DDDSample1.Domain.Specializations;
using System.Collections.Generic;

namespace DDDSample1.Tests.Staffs.IntegrationTests
{
    public class StaffControllerServiceIntegrationTests : IClassFixture<TestWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;
        private readonly TestWebApplicationFactory<Startup> _factory;
        private readonly StaffService _service;
        private readonly IStaffMapper _mappers;
        private readonly IConfiguration _configuration;

        public StaffControllerServiceIntegrationTests(TestWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
            _factory.ResetDatabase();
            _configuration = factory.Services.GetService<IConfiguration>();
            _service = factory.Services.GetService<StaffService>();
            _mappers = factory.Services.GetService<IStaffMapper>();
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

        public string CreateTokenStaffDTO(StaffDTO staff)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, staff.Id.ToString()),
                new Claim(ClaimTypes.Email, staff.Email),
                new Claim("PhoneNumber", staff.PhoneNumber)
            };

            var key = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException(nameof(key), "JWT key cannot be null or empty.");
            }
        
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var cred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: cred
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
        
        //Creat Staff Test Ingration
        [Fact]
        public async Task CreateStaff_ShouldReturnOk_WhenStaffIsCreated()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var specializationDTO = new CreatingSpecializationDTO
            {
                SpecOption = "Specialization"
            };

            await _client.PostAsJsonAsync("/api/Specialization", specializationDTO);
            
            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "Afonso",
                LastName = "Test",
                FullName = "Afonso Test",
                Email = "test3231@example.com",
                PhoneNumber = "+351932395521",
                StaffType = "Admin",
                SpecializationName = "Specialization"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/Staff", staffDTO);

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task CreateStaff_ShouldReturnError_WhenStaffAlreadyExists()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var specializationDTO = new CreatingSpecializationDTO
            {
                SpecOption = "Specialization"
            };

            await _client.PostAsJsonAsync("/api/Specialization", specializationDTO);
            
            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "Afonso",
                LastName = "Test",
                FullName = "Afonso Test",
                Email = "test3231@example.com",
                PhoneNumber = "+351932395521",
                StaffType = "Admin",
                SpecializationName = "Specialization"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/Staff", staffDTO);

            // Assert
            response.EnsureSuccessStatusCode();

            // Act
            var response2 = await _client.PostAsJsonAsync("/api/Staff", staffDTO);

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.BadRequest, response2.StatusCode);
        }

        //Update Staff Test Ingration
        [Fact]
        public async Task UpdateStaff_ShouldReturnOk_WhenStaffIsUpdated()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "Afonso",
                LastName = "Test",
                FullName = "Afonso Test",
                Email = "test@example.com",
                PhoneNumber = "+351987654322",
                StaffType = "Admin",
                SpecializationId = Guid.NewGuid()
            };

            var createResponse = await _client.PostAsJsonAsync("/api/Staff", staffDTO);
            createResponse.EnsureSuccessStatusCode();
            var createdStaff = await createResponse.Content.ReadFromJsonAsync<StaffDTO>();
            var id = createdStaff.Id;

            var updateStaffDTO = new UpdateStaffDTO
            {
                Email = "test2@example.com",
                PhoneNumber = "+351987654321",
                AddAvailabilitySlots = "2024-12-31 23:59",
                RemoveAvailabilitySlots = "2024-12-31 23:59"
            };

            // Act
            var response = await _client.PutAsJsonAsync($"/api/Staff/{id}", updateStaffDTO);

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task UpdateStaff_ShouldReturnNotFound_WhenStaffDoesNotExist()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var updateStaffDTO = new UpdateStaffDTO
            {
                Email = "test@example.com",
                PhoneNumber = "+351987654321",
                AddAvailabilitySlots = "2024-12-31 23:59",
                RemoveAvailabilitySlots = "2024-12-31 23:59"
            };

            // Act
            var response = await _client.PutAsJsonAsync($"/api/Staff/{Guid.NewGuid()}", updateStaffDTO);

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

        
        //Update Staff contact info Test Ingration
        /*
        [Fact]
        public async Task UpdatePhoneNumberAsync_ShouldReturnOk_WhenPhoneNumberIsUpdated()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            
            // Arrange
            var specializationDTO = new CreatingSpecializationDTO
            {
                SpecOption = "Specialization"
            };

            await _client.PostAsJsonAsync("/api/Specialization", specializationDTO);
            
            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "Afonso",
                LastName = "Test",
                FullName = "Afonso Test",
                Email = "test@example.com",
                PhoneNumber = "+351932395521",
                SpecializationName = "Specialization"
            };

            var createResponse = await _client.PostAsJsonAsync("/api/Staff", staffDTO);
            createResponse.EnsureSuccessStatusCode();
            var createdStaff = await createResponse.Content.ReadFromJsonAsync<StaffDTO>();
            var tokenStaff = CreateTokenStaffDTO(createdStaff);

            // Act
            var response = await _client.PutAsync($"/api/Staff/ConfirmUpdates?phoneNumber=+351987655678&email=test222@example.com&token={tokenStaff}", null);

            // Assert
            response.EnsureSuccessStatusCode();
        }*/

        [Fact]
        public async Task UpdatePhoneNumberAsync_ShouldReturnBadRequest_WhenTokenIsMissing()
        {
            // Arrange

            // Act
            var response = await _client.PutAsync($"/api/Staff/ConfirmUpdates?phoneNumber=+351987654321&email=test@example.com", null);

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task UpdatePhoneNumberAsync_ShouldReturnBadRequest_WhenPhoneNumberAndEmailAreMissing()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var staff = new Staff("Afonso", "Test", "Afonso Test","test@example.com","+351987654322", StaffType.Admin, new SpecializationId(Guid.NewGuid()) );
            var tokenStaff = _service.CreateTokenStaff(staff);
            // Act
            var response = await _client.PutAsync($"/api/Staff/ConfirmUpdates?token={token}", null);

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
        }
    
        //Deattive Staff Test Ingration
        [Fact]
        public async Task DeactivateStaff_ShouldReturnOk_WhenStaffIsDeactivated()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "Afosno",
                LastName = "Test",
                FullName = "Afonso Test",
                Email = "teste@example.com",
                PhoneNumber = "+351932395506",
                StaffType = "Admin",
                SpecializationId = Guid.NewGuid()
            };

            var createResponse = await _client.PostAsJsonAsync("/api/Staff", staffDTO);
            createResponse.EnsureSuccessStatusCode();
            var createdStaff = await createResponse.Content.ReadFromJsonAsync<StaffDTO>();
            var id = createdStaff.Id;

            // Act
            var response = await _client.PutAsync($"/api/Staff/deactivate/{id}", null);

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task DeactivateStaff_ShouldReturnNotFound_WhenStaffDoesNotExist()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await _client.PutAsync($"/api/Staff/deactivate/{Guid.NewGuid()}", null);

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

        //Search Staffs Test Ingration
        [Fact]
        public async Task SearchStaffProfiles_ShouldReturnOk_WhenStaffProfilesAreFound()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Arrange
            var staffDTO = new CreatingStaffDTO
            {
                FirstName = "John",
                LastName = "Doe",
                FullName = "John Doe",
                Email = "john.doe@example.com",
                PhoneNumber = "+123456789",
                StaffType = "Admin",
                SpecializationId = Guid.NewGuid()
            };

            var createResponse = await _client.PostAsJsonAsync("/api/Staff", staffDTO);
            createResponse.EnsureSuccessStatusCode();

            // Act
            var response = await _client.GetAsync($"/api/Staff/search?firstName=John&lastName=Doe");

            // Assert
            response.EnsureSuccessStatusCode();

            var staffProfiles = await response.Content.ReadFromJsonAsync<StaffDTO[]>();
            Assert.NotEmpty(staffProfiles);
            Assert.Contains(staffProfiles, s => s.Email == staffDTO.Email);
        }

        [Fact]
        public async Task SearchStaffProfiles_ShouldReturnOk_WhenNoStaffProfilesAreFound()
        {
            var token = GenerateAdminJwtToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await _client.GetAsync($"/api/Staff/search?firstName=NonExistent&lastName=User");

            // Assert
            response.EnsureSuccessStatusCode();

            var message = await response.Content.ReadAsStringAsync();
            Assert.Equal("No staff profiles found with the given criteria.", message);
        }
    }
}