using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {

        private readonly StaffService _staffService;
        
        public StaffController(StaffService staffService)
        {
            this._staffService = staffService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StaffDTO>> CreateStaff(CreatingStaffDTO dto)
        {
            try
            {
                var createdStaff = await _staffService.CreateStaffAsync(dto);

                // Retorna o staff criado com o status 201 Created
                return Ok(createdStaff);
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

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StaffDTO>> UpdateStaff(Guid id, UpdateStaffDTO dto)
        {
            try
            {
                var updatedStaff = await _staffService.UpdateStaffAsync(id, dto);

                if (updatedStaff == null)
                {
                    return NotFound(new { Message = $"Staff with ID {id} not found." });
                }

                return Ok(new { Message = "Staff updated successfully.", Staff = updatedStaff });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating the staff: {ex.Message}");
            }
        }

        [HttpPut("deactivate/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StaffDTO>> DeactivateStaff(Guid id)
        {
            try
            {
                var deactivatedStaff = await _staffService.DeactivateStaffAsync(id);

                if (deactivatedStaff==null)
                {
                    return NotFound(new { message = $"Staff with ID {id} not found." });
                }

                return Ok(deactivatedStaff);
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

        [HttpPut("ConfirmUpdates")]
        public async Task<IActionResult> UpdatePhoneNumberAsync([FromQuery] string  phoneNumber, [FromQuery]string email, [FromQuery] string token)
        {
            try
            {
                await _staffService.UpdateContactInformationAsync(token, phoneNumber, email);
                return Ok("Updated Profile Staff successfully.");
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
        

        [HttpGet("search")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<StaffDTO>>> SearchStaffProfiles(string firstName, string lastName, string email, string fullName, string specializationName)
        {
            var dto = new SearchStaffDTO
            {
                FirstName = firstName,
                LastName = lastName,
                FullName = fullName,
                Email = email,
                SpecializationName = specializationName
            };

            try
            {
                var staffProfiles = await _staffService.SearchStaffProfiles(dto);

                if (staffProfiles == null || staffProfiles.Count == 0)
                {
                    return Ok("No staff profiles found with the given criteria.");
                }

                return Ok(staffProfiles);
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


    }
}