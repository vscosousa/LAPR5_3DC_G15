
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

        [HttpPost("RegisterUserAsStaff")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> RegisterUserAsStaff(CreatingStaffUserDTO userDTO)
        {   
            try
            {
                var user = await _userService.CreateUserAsStaff(userDTO);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while register Satff in: {ex.Message}");
            }
        }

        //request email to recover password
        [HttpPost("ResetPasswordByEmail")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> ResetPasswordByEmail([FromBody]ResetPasswordDTO resetPasswordDto)
        {   
            try
            {
                var user = await _userService.ResetPasswordEmail(resetPasswordDto.Email);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while sending email to reset Password in: {ex.Message}");
            }
        }

        //"https://localhost:5001/api/user/ResetPassword?token={token}" reset password
        [HttpPost("ResetPassword")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDto, [FromQuery] string token)
        {
            try
            {   
                if (string.IsNullOrEmpty(resetPasswordDto.NewPassword) || string.IsNullOrEmpty(resetPasswordDto.NewPasswordConfirm))
                {
                    throw new Exception("Both password fields must be filled!");
                }

                // Check if passwords match
                if (!string.Equals(resetPasswordDto.NewPassword, resetPasswordDto.NewPasswordConfirm, StringComparison.Ordinal))
                {
                    throw new Exception("Passwords do not match!");
                }

                var user = await _userService.ActivateUser(token, resetPasswordDto.NewPassword);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while activating the user: {ex.Message}");
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
    }
}