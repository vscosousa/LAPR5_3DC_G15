using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
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

        [HttpPost("RegisterUser"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDTO>> RegisterUser([FromBody] CreatingUserDTO userDTO)
        {
            try
            {
                var result = await _userService.CreateUser(userDTO);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while registering the user: {ex.Message}");
            }
        }

        [HttpPost("RegisterUserAsPatient")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> RegisterUserAsPatient(CreatingPatientUserDTO userDTO)
        {
            try
            {
                var user = await _userService.CreateUserAsPatient(userDTO);
                if (user == null)
                {
                    return NotFound("There is no patient with the provided email registered in the system.");
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating the user: {ex.Message}");
            }
        }

        [HttpPost("RequestResetPassword"), Authorize(Roles = "Admin, Doctor, Nurse, Technician")]
        public async Task<IActionResult> RequestPasswordReset(RequestPasswordResetDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                return NotFound( "Email is required." );
            }

            try
            {
                await _userService.RequestPasswordReset(dto.Email);
                return Ok("Password reset link has been sent to your email.");
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deactivating the staff", details = ex.Message });
            }
        }

        // POST: api/PasswordReset/Reset
        [HttpPost("ResetPassword"), AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromQuery]string token, ResetPasswordDTO dto)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return Unauthorized("Token required.");
            }
            if (string.IsNullOrWhiteSpace(dto.NewPassword) && string.IsNullOrWhiteSpace(dto.NewPasswordConfirm))
            {
                return BadRequest("Token and new password are required.");
            }
            try
            {
                await _userService.ResetPassword(token, dto);
                return Ok("Your password has been reset successfully.");
            }
            catch (BusinessRuleValidationException ex)
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
                if (user == null)
                {
                    return NotFound("User not found");
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while activating the user: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginUserDTO userDTO)
        {
            try
            {
                var token = await _userService.Login(userDTO);

                if (token == null)
                {
                    return Unauthorized("Invalid email or password.");
                }

                return Ok(token);
            }
            catch (Exception ex)
            {
                // Return a 500 error for unexpected exceptions
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

        [HttpDelete("DeleteUser/{token}"), AllowAnonymous]
        public async Task<ActionResult> DeleteUser(string token)
        {
            try
            {
                await _userService.DeleteUser(token);
                return Ok();
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

        //request user patient profile
        [HttpPost("RequestUpdateUserPatient"), Authorize(Roles = "Patient")]
        public async Task<IActionResult> RequestUpdateUserPatient(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Email is required.");
            }

            try
            {
                await _userService.RequestUpdateUserPatient(email);
                return Ok("Request sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //update user patient profile
        [HttpPost("UpdateUserPatient"), Authorize (Roles = "Patient")]
        public async Task<IActionResult> UpdateUserPatient(string token, UpdatePatientUserDTO userDTO)
        {
            try
            {
                await _userService.UpdateUserPatient(token, userDTO);
                return Ok("User updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}