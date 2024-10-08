using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
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
            this._patientService = patientService;
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
        public async Task<IActionResult> DeletePatient(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new { message = "Patient ID is required." });
            }

            try
            {
                var patientId = new PatientId(id);
                var result = await _patientService.DeletePatient(patientId);

                if (result == null)
                {
                    return NotFound(new { message = "Patient not found." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}