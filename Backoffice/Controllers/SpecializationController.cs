using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Specializations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializationController : ControllerBase
    {

        private readonly SpecializationService _specializationService;
        public SpecializationController(SpecializationService specializationService)
        {
            _specializationService = specializationService;
        }

        // POST api/specilization
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<SpecializationDTO>> CreateSpecialization(CreatingSpecializationDTO specializationDTO)
        {
            try
            {
                var specialization = await _specializationService.CreateSpecializationAsync(specializationDTO);
                return Ok(specialization);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating the operation type: {ex.Message}");
            }
        }


        // GET api/specialization/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSpecialization(Guid id)
        {
            try
            {
                var specialization = await _specializationService.GetSpecializationByIdAsync(new SpecializationId(id));
                return Ok(specialization);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving the specialization: {ex.Message}");
            }
        }

        // GET api/specialization
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<SpecializationDTO>>> GetAllSpecializations()
        {
            try
            {
                var specializations = await _specializationService.GetAllSpecializationsAsync();
                return Ok(specializations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving the specializations: {ex.Message}");
            }
        }
    }
}