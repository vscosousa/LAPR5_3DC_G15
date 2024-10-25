
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xunit.Sdk;

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

        [HttpPost("RegisterUser"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDTO>> RegisterUser([FromBody] CreatingUserDTO userDTO)
        {
            try
            {
                var result = await _userService.CreateUser(userDTO);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while registering the user: {ex.Message}");
            }
        }

        [HttpPost("RegisterUserAsPatient")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDTO>> RegisterUserAsPatient(CreatingPatientUserDTO userDTO)
        {
            try
            {
                var user = await _userService.CreateUserAsPatient(userDTO);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating the user: {ex.Message}");
            }
        }

        [HttpPost("RequestResetPassword"), AllowAnonymous]
        public async Task<IActionResult> RequestPasswordReset(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Email is required.");
            }

            try
            {
                await _userService.RequestPasswordReset(email);
                return Ok("Password reset link has been sent to your email.");
            }
            catch (Exception ex)
            {
                // Log exception (ex) if needed
                return StatusCode(500, ex.Message);
            }
        }

        // POST: api/PasswordReset/Reset
        [HttpPost("ResetPassword"), AllowAnonymous]
        public async Task<IActionResult> ResetPassword(string token, string newPassword)
        {
            if (string.IsNullOrWhiteSpace(token) ||
                string.IsNullOrWhiteSpace(newPassword))
            {
                return BadRequest("Token and new password are required.");
            }

            try
            {
                await _userService.ResetPassword(token, newPassword);
                return Ok("Your password has been reset successfully.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.Message);
            }
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
        public async Task<ActionResult<UserDTO>> ActivatePatientUser(string token)
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
        public async Task<ActionResult> RequestDelete([FromBody] string token)
        {
            try
            {
                await _userService.RequestDelete(token);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message == "User not found")
                {
                    return NotFound("User not found");
                }
                return StatusCode(500, $"An error occurred while deleting the user: {ex.Message}");
            }
        }

        [HttpDelete("DeleteUser/{token}"), Authorize(Roles = "Patient")]
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

        [HttpGet("GetAllUsers"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDTO>> GetAllUsers()
        {

            try
            {
                var users = await _userService.getAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while getting all users: {ex.Message}");
            }
        }
    }
}