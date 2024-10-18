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
            this._specializationService = specializationService;
        }

        // POST api/specilization
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Specialization>> CreateSpecialization(CreatingSpecializationDTO specializationDTO)
        {
            try
            {
                var specialization = await this._specializationService.CreateSpecializationAsync(specializationDTO);
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
    }
}