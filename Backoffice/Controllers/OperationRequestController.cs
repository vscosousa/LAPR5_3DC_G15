using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class OperationRequestController : ControllerBase
    {
        private readonly OperationRequestService _operationRequestService;
        public OperationRequestController(OperationRequestService operationRequestService)
        {
            _operationRequestService = operationRequestService;
        }

        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<OperationRequestDTO>> CreateOperationRequest(CreatingOperationRequestDTO operationRequestDTO)
        {
            try
            {
                var operationRequest = await _operationRequestService.AddOperationRequestAsync(operationRequestDTO);
                return Ok(operationRequest);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message); // Return BadRequest for already existing name
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating the operation request: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<OperationRequestDTO>> UpdateOperationRequestAsync(Guid id, Guid doctorId, UpdatingOperationRequestDTO operationRequestDto)
        {
            try
            {
                var updatedOperationRequest = await _operationRequestService.UpdateOperationRequestAsync(id, doctorId, operationRequestDto);

                if (updatedOperationRequest == null)
                {
                    return NotFound(new { Message = $"Operation Request with ID {id} not found." });
                }

                return Ok(new { Message = "Operation Request updated successfully.", OperationRequest = updatedOperationRequest });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("schedule/{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult> ScheduleOperationRequestAsync(Guid id)
        {
            Console.WriteLine($"ScheduleOperationRequestAsync called with id: {id}");
            try
            {
                var result = await _operationRequestService.ScheduleOperationRequest(id);

                if (!result)
                {
                    return NotFound(new { Message = $"Operation Request with ID {id} not found." });
                }

                return Ok(new { Message = "Operation Request scheduled successfully." });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while scheduling the operation request.", Details = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult> DeleteOperationRequestAsync(Guid id, string doctorLicenseNumber)
        {
            try
            {
                await _operationRequestService.RemoveOperationRequestAsync(id, doctorLicenseNumber);
                return Ok(new { Message = "Operation Request deleted successfully." });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<IEnumerable<SearchedOperationRequestDTO>>> GetAllOperationRequestsAsync(string patientName, string operationType, string status, string priority)
        {
            var dto = new SearchOperationRequestDTO(patientName, operationType, status, priority);
            try
            {
                var operationRequests = await _operationRequestService.SearchOperationRequests(dto);
                return Ok(operationRequests);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}