using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {

        private readonly PatientService _patientService;
        public PatientController(PatientService patientService)
        {
            _patientService = patientService;
        }
        // POST api/user
        // US 5.1.1
        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient(CreatingPatientDTO patientDTO) // Change the DTO
        {
            try
            {
                var patient = await _patientService.CreatePatient(patientDTO);
                return Ok(patient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating the patient: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<PatientDTO>> DeletePatient(Guid id)
        {
            try
            {
                var cat = await _patientService.DeletePatient(new PatientId(id));

                if (cat == null)
                {
                    return NotFound();
                }

                return Ok(cat);
            }
            catch(BusinessRuleValidationException ex)
            {
               return BadRequest(new {Message = ex.Message});
            }
            } 
    }
}