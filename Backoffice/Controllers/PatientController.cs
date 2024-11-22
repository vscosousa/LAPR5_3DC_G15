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
    [Authorize (Roles = "Admin")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly PatientService _service;

        public PatientController(PatientService patientService)
        {
            _service = patientService;
            
        }

        [HttpPost]
        public async Task<ActionResult<PatientDTO>> CreatePatient(CreatingPatientDTO patientDTO)
        {
            try
            {
                var patient = await _service.CreatePatient(patientDTO);
                return Ok(patient);
            }
            catch (Exception ex)
            {
                if (ex is BusinessRuleValidationException)
                {
                    return BadRequest(new { Message = ex.Message });
                }
                return StatusCode(500, $"An error occurred while creating the patient: {ex.Message}");
            }
        }

        [HttpDelete("{medicalRecordNumber}")]
        public async Task<ActionResult<PatientDTO>> DeletePatient(string medicalRecordNumber)
        {
            try
            {
                var cat = await _service.DeletePatient(medicalRecordNumber);

                if (cat == null)
                {
                    return NotFound();
                }

                return Ok(cat);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{medicalRecordNumber}")]
        public async Task<ActionResult<PatientDTO>> UpdatePatient(string medicalRecordNumber, UpdatePatientDTO dto)
        {
            try
            {
                var patient = await _service.UpdatePatient(medicalRecordNumber, dto);

                if (patient == null)
                {
                    return NotFound();
                }
                return Ok(patient);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet]
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
                    return NotFound();
                }
                return Ok(patients);
            } catch (Exception ex) {
                return StatusCode(500, $"An error occurred while searching for patients: {ex.Message}");
            }
        }

        [HttpPut("updateProfile")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<PatientDTO>> UpdateProfile(UpdatePatientDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var patient = await _service.UpdatePatientProfile(dto);
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
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating the profile: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDTO loginDto)
        {
            try
            {
                var token = await _service.LoginPatient(loginDto);
                return Ok(token);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}