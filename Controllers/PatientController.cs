using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly PatientService _service;

        public PatientController(PatientService patientService)
        {
            _service = patientService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Patient>> CreatePatient(CreatingPatientDTO patientDTO)
        {
            try
            {
                var patient = await _service.CreatePatient(patientDTO);
                return Ok(patient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating the patient: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<PatientDTO>> DeletePatient(Guid id)
        {
            try
            {
                var cat = await _service.DeletePatient(new PatientId(id));

                if (cat == null)
                {
                    return NotFound();
                }

                return Ok(cat);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<PatientDTO>> UpdatePatient(Guid id, UpdatePatientDTO dto)
        {
            try
            {
                var patient = await _service.UpdatePatient(id, dto);

                if (patient == null)
                {
                    return NotFound();
                }
                return Ok(patient);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PatientDTO>>> SearchPatients(string firstName, string lastName, string fullName, string dateOfBirth, string medicalRecordNumber, string gender, string email, string phoneNumber)
        {
            var dto = new SearchPatientDTO
            {
                FirstName = firstName,
                LastName = lastName,
                FullName = fullName,
                DateOfBirth = dateOfBirth,
                Gender = gender,
                MedicalRecordNumber = medicalRecordNumber,
                Email = email,
                PhoneNumber = phoneNumber
            };
            try {
                var patients = await _service.SearchPatients(dto);
                if (patients == null) {
                    return Ok("No patients found with the given criteria.");
                }
                return Ok(patients);
            } catch (Exception ex) {
                return StatusCode(500, $"An error occurred while searching for patients: {ex.Message}");
            }
        }
    }
}