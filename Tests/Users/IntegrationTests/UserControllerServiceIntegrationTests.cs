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

[Collection("Integration Collection")]
public class UserControllerServiceIntegrationTests : IClassFixture<TestWebApplicationFactory<Startup>>
{
    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Startup> _factory;


    public UserControllerServiceIntegrationTests(TestWebApplicationFactory<Startup> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private string GenerateJwtToken()
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

    /* [Fact]
    public async Task RegisterUser_ShouldReturnOk_WhenUserIsCreated()
    {
        // Arrange
        var userDTO = new CreatingUserDTO
        {
            Email = "testuser@example.com",
            Username = "testuser",
            Role = 0
        };

        var token = GenerateJwtToken();
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

        var token = GenerateJwtToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // create user with the same email
        var createResponse = await _client.PostAsJsonAsync("/api/user/RegisterUser", existingUserDTO);
        Assert.True(createResponse.IsSuccessStatusCode); 

        var newUserDTO = new CreatingUserDTO
        {
            Email = "testuser2@example.com", 
            Username = "newuser2",
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

        var token = GenerateJwtToken();
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
    } */
}