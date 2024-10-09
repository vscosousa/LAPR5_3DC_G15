
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
        public async Task<ActionResult<User>> CreateUser(CreatingUserDTO userDTO)
        {
            try{
                var user = await this._userService.CreateUser(userDTO);
                return Ok(user);
            }
            catch (Exception ex){
                return StatusCode(500, $"An error occurred while creating the user: {ex.Message}");
            }
        }

    }
    
}