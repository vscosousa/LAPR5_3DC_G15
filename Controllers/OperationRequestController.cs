using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationRequests;  // Add this line
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace DDDSample1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Doctor")] // Add this at controller level for doctor-only access
    public class OperationRequestController : ControllerBase
    {
        private readonly IOperationRequestRepository _service;
        private readonly IPlanningModuleNotifier _planningModuleService; 
        public OperationRequestController(IOperationRequestRepository service, IPlanningModuleNotifier planningModuleService)
        {
            _service = service;
            _planningModuleService = planningModuleService;
        }

        [HttpPost]
        public async Task<ActionResult<OperationRequest>> CreateOperationRequest([FromBody] CreatingOperationRequestDTO dto)
        {
            try
            {
                var result = await _service.CreateOperationRequestAsync(dto);
                return CreatedAtAction(nameof(GetOperationRequest), new { id = result.Id.ToString() }, result);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OperationRequest>> GetOperationRequest(string id)
        {
            var operationRequest = await _service.GetByIdAsync(new OperationRequestId(Guid.Parse(id)));
            if (operationRequest == null)
            {
                return NotFound();
            }
            return Ok(operationRequest);
        }

        [HttpGet]
        public async Task<ActionResult<List<OperationRequest>>> GetAllOperationRequests()
        {
            var operationRequests = await _service.GetAllAsync();
            return Ok(operationRequests);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOperationRequest(string id, [FromBody] UpdateOperationRequestDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("ID mismatch");
            }

            // Get current staff's ID from the authenticated user
            var currentStaffId = User.FindFirst("StaffId")?.Value;
            if (string.IsNullOrEmpty(currentStaffId))
            {
                return Unauthorized("User is not a staff");
            }

            try
            {
                var updated = await _service.UpdateOperationRequestAsync(id, dto, currentStaffId);
                if (updated == null)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                // Log the exception
                return StatusCode(500, "An error occurred while updating the operation request.");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> DeleteOperationRequest(string id, [FromQuery] bool confirmed = false)
        {
            // Get current staff's ID
            var currentStaffId = User.FindFirst("StaffId")?.Value;
            if (string.IsNullOrEmpty(currentStaffId))
            {
                return Unauthorized("User is not a staff");
            }

            // Verify ownership and status
            var request = await _service.GetByIdAsync(new OperationRequestId(Guid.Parse(id)));
            if (request == null)
                return NotFound();
            
            if (request.CreatedByStaffId.Value != currentStaffId)
                return StatusCode(403, "You can only delete your own requests");
            
            if (request.Status == RequestStatus.Scheduled)
                return BadRequest("Cannot delete scheduled operations");

            if (!confirmed)
            {
                // Return 202 Accepted with confirmation required
                return StatusCode(202, new 
                {
                    message = "Please confirm deletion of operation request",
                    requiresConfirmation = true,
                    confirmationUrl = $"/api/OperationRequest/{id}?confirmed=true"
                });
            }

            try
            {
                var deleted = await _service.DeleteOperationRequestAsync(id);
                if (!deleted)
                {
                    return NotFound();
                }
                
                // Notify planning module (needs to be implemented)
                await _planningModuleService.NotifyOperationRequestDeleted(id);
                
                return NoContent();
            }
            catch (Exception)
            {
                // Log the exception
                return StatusCode(500, "An error occurred while deleting the operation request.");
            }
        }

        [HttpGet("staff/{staffId}")]
        public async Task<ActionResult<List<OperationRequest>>> GetOperationRequestsByStaff(string staffId)
        {
            var operationRequests = await _service.GetOperationRequestsByStaffAsync(staffId);
            return Ok(operationRequests);
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<OperationRequestDTO>>> SearchOperationRequests(
            [FromQuery] SearchOperationRequestDTO searchParams)
        {
            try
            {
                var searchCriteria = new OperationRequestSearchParams(
                    patientName: searchParams.PatientName,
                    operationType: searchParams.OperationType,
                    priority: searchParams.PriorityLevel != null ? Enum.Parse<PriorityLevel>(searchParams.PriorityLevel) : null,
                    status: searchParams.Status != null ? Enum.Parse<RequestStatus>(searchParams.Status) : null,
                    startDate: searchParams.StartDate,
                    endDate: searchParams.EndDate
                );
                var results = await _service.SearchOperationRequestsAsync(searchCriteria);
                // Map to DTO to include patient name and operation type details
                var dtos = results.Select(r => new OperationRequestDTO(
                    Guid.Parse(r.Id.ToString()),
                    r.PatientId.ToString(),
                    r.CreatedByStaffId.Value,
                    r.OperationTypeId.ToString(),
                    r.Deadline,
                    r.Priority,
                    r.CreatedAt,
                    r.Status,
                    r.Patient
                ));
                return Ok(dtos);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
