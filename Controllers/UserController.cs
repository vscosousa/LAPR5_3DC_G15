
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
            _userService = userService;
        }
    
        [HttpPost("Create")]
        public async Task<ActionResult<User>> CreateUser(CreatingUserDTO userDTO)
        {
            try
            {
                var user = await _userService.CreateUser(userDTO);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating the user: {ex.Message}");
            }
        }
    
        [HttpPost("Login")]
        public async Task<ActionResult<string>> Login(UserDTO userDTO)
        {
            try
            {
                var token = await _userService.Login(userDTO);
                return Ok(token);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while logging in: {ex.Message}");
            }
        }
    }
}