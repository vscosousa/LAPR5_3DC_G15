using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using System.Threading.Tasks;
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
        
        // Método para listar todos os staffs
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<StaffDTO>>> GetAllStaffs()
        {
            try
            {
                var staffs = await _staffService.GetAllStaffsAsync();
                return Ok(staffs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving the staffs: {ex.Message}");
            }
        }

        // Método para listar um staff por ID
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<StaffDTO>> GetStaffById(Guid id)
        {
            try
            {
                var staff = await _staffService.GetStaffByIdAsync(id);

                if (staff == null)
                {
                    return NotFound();
                }

                return Ok(staff);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving the staff: {ex.Message}");
            }
        }

        [HttpPost]
        [AllowAnonymous] 
        public async Task<ActionResult<StaffDTO>> CreateStaff(CreatingStaffDTO dto)
        {
            try
            {
                var createdStaff = await _staffService.CreateStaffAsync(dto);

                // Retorna o staff criado com o status 201 Created
                return Ok(createdStaff);
            }
            catch (Exception ex)
            {
                // Lida com outros tipos de erros
                return StatusCode(500, $"An error occurred while creating the staff: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize (Roles = "Admin")] 
        public async Task<ActionResult<StaffDTO>> DeleteStaff(Guid id)
        {
            try
            {
                // Chama o serviço para deletar o paciente
                var deletedPatient = await _staffService.DeleteStaffAsync(new StaffId(id));

                // Verifica se o paciente foi encontrado e deletado
                if (deletedPatient == null)
                {
                    return NotFound(new { Message = $"staff with ID {id} not found." });
                }

                return Ok(new { Message = "Staff deleted successfully.", Patient = deletedPatient });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting the Staff: {ex.Message}");
            }
        }
    }
}