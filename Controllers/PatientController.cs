using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;  // Add this line
using Microsoft.AspNetCore.Http.Json;
using System.Text.Json;
using DDDSample1.Domain.Logs;  // Add this line

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [Authorize (Roles = "Admin")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly PatientService _service;
        private readonly IEmailService _emailService;
        private readonly IAuditLogService _auditLogService;

        public PatientController(PatientService patientService, IEmailService emailService, IAuditLogService auditLogService)
        {
            _service = patientService;
            _emailService = emailService;
            _auditLogService = auditLogService;
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

        [HttpDelete("{id}")]
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
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
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

        [Authorize(Roles = "Patient")]
        [HttpPost("deletion-request")]
        public async Task<ActionResult> RequestAccountDeletion()
        {
            try
            {
                var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                
                if (string.IsNullOrEmpty(patientId))
                    return Unauthorized();

                // Create deletion request
                var deletionRequest = await _service.CreateDeletionRequest(Guid.Parse(patientId));
                
                // Send confirmation email
                await _emailService.SendDeletionConfirmationEmail(
                    email,
                    deletionRequest.ConfirmationToken,
                    deletionRequest.ExpiryDate
                );

                return Ok(new { 
                    message = "Deletion request received. Please check your email to confirm the deletion.",
                    expiryDate = deletionRequest.ExpiryDate 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while requesting account deletion: {ex.Message}");
            }
        }

        [Authorize(Roles = "Patient")]
        [HttpPut("profile")]
        public async Task<ActionResult<PatientDTO>> UpdateProfile(UpdatePatientDTO dto)
        {
            try
            {
                var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(patientId))
                    return Unauthorized();

                // Get current patient data for comparison
                var currentPatient = await _service.GetPatientById(Guid.Parse(patientId));
                
                // Create detailed audit log with field-by-field changes
                var changes = new Dictionary<string, object>();
                if (dto.FirstName != currentPatient.FirstName) changes.Add("FirstName", new { Old = currentPatient.FirstName, New = dto.FirstName });
                if (dto.LastName != currentPatient.LastName) changes.Add("LastName", new { Old = currentPatient.LastName, New = dto.LastName });
                if (dto.PhoneNumber != currentPatient.PhoneNumber) changes.Add("PhoneNumber", new { Old = currentPatient.PhoneNumber, New = dto.PhoneNumber });

                var auditLog = new AuditLog
                {
                    UserId = patientId,
                    TypeOfAction = TypeOfAction.ProfileUpdate,
                    Changes = JsonSerializer.Serialize(new { 
                        UpdatedFields = changes,
                        UpdatedBy = User.FindFirst(ClaimTypes.Name)?.Value,
                        UpdatedAt = DateTime.UtcNow
                    })
                };
                await _auditLogService.LogAsync(auditLog);

                // Update the patient profile
                var patient = await _service.UpdatePatientProfile(Guid.Parse(patientId), dto);

                // Handle email verification if email is changed
                if (!string.IsNullOrEmpty(dto.Email) && dto.Email != currentPatient.Email)
                {
                    // Log specific audit entry for email change
                    var emailChangeAudit = new AuditLog
                    {
                        UserId = patientId,
                        TypeOfAction = TypeOfAction.EmailChange,
                        Changes = JsonSerializer.Serialize(new { 
                            OldEmail = currentPatient.Email,
                            NewEmail = dto.Email,
                            VerificationRequired = true
                        })
                    };
                    await _auditLogService.LogAsync(emailChangeAudit);

                    // Send verification email
                    await _emailService.SendEmailVerificationRequest(
                        dto.Email,
                        patient.EmailVerificationToken,
                        patient.EmailVerificationExpiry
                    );
                    
                    return Ok(new { 
                        message = "Profile updated. Please check your email to verify your new email address.",
                        patient = patient
                    });
                }

                return Ok(new {
                    message = "Profile updated successfully",
                    patient = patient
                });
            }
            catch (Exception ex)
            {
                // Log the error
                var errorAudit = new AuditLog
                {
                    UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                    TypeOfAction = TypeOfAction.Error,
                    Message = ex.Message,
                    Changes = JsonSerializer.Serialize(new { 
                        AttemptedChanges = dto,
                        ErrorMessage = ex.Message
                    })
                };
                await _auditLogService.LogAsync(errorAudit);

                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
