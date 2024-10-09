
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.User;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            this._userService = userService;
        }

        // POST api/user
        // US 5.1.1 - Creates a new user (for both admin and self-registered)
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreatingUserDTO request)
        {
            try
            {
                // Create the user using the service
                var userDto = await _userService.CreateUser(
                    new Email(request.Email),
                    new Username(request.Username),
                    request.Role);

                // Return a 201 Created status with the created user data
                return CreatedAtAction(nameof(CreateUser), new { id = userDto.Id }, userDto);
            }
            catch (Exception ex)
            {
                // Handle errors and return a 400 Bad Request or other appropriate status code
                return BadRequest(new { message = ex.Message });
            }
        }

    }
    
}