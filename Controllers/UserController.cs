
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Authorization;
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
    
    
        
        [HttpPost("RegisterUser"), Authorize (Roles = "Admin")]
        public async Task<ActionResult<User>> RegisterUser(CreatingUserDTO userDTO)
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

        [HttpPost("RegisterUserAsPatient")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> RegisterUserAsPatient(CreatingPatientUserDTO userDTO)
        {
            
                var user = await _userService.CreateUserAsPatient(userDTO);
                return Ok(user);
        }

        //Activate user and set password
        [HttpPost("Activate")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> ActivateUser(string token, string newPassword)
        {
            try
            {
                var user = await _userService.ActivateUser(token, newPassword);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while activating the user: {ex.Message}");
            }
        }

        [HttpPost("ActivatePatientUser")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> ActivatePatientUser(string token)
        {
            try
            {
                var user = await _userService.ActivateUserAsPatient(token);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while activating the user: {ex.Message}");
            }
        }
        
        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> Login(LoginUserDTO userDTO)
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

        [HttpPost("RequestDelete"), Authorize(Roles = "Patient")]
        public async Task<ActionResult> RequestDelete(string token)
        {
            try
            {
                await _userService.RequestDelete(token);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting the user: {ex.Message}");
            }
        }

        [HttpDelete("Delete"), Authorize(Roles = "Patient")]
        public async Task<ActionResult> DeleteUser(string token)
        {
            try
            {
                await _userService.DeleteUser(token);
                return Ok("User deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting the user: {ex.Message}");
            }
        }
    }
}