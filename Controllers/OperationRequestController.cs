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
    [Authorize (Roles = "Admin")]
    [ApiController]
    public class OperationRequestController : ControllerBase
    {
        private readonly OperationRequestService _service;

        public OperationRequestController(OperationRequestService operationRequestService)
        {
            _service = operationRequestService;
        }

        [HttpPost]
        public async Task<ActionResult<OperationRequestDTO>> CreateOperationRequestAsync(CreatingOperationRequestDTO operationRequestDto)
        {
            try
            {
                var operationRequest = await _service.AddOperationRequestAsync(operationRequestDto);
                return Ok(operationRequest);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<OperationRequestDTO>> UpdateOperationRequestAsync(Guid id, Guid doctorId , UpdatingOperationRequestDTO operationRequestDto)
        {
            try
            {
                var updatedOperationRequest = await _service.UpdateOperationRequestAsync(id, doctorId, operationRequestDto);

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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOperationRequestAsync(Guid id, Guid doctorId)
        {
            try
            {
                await _service.RemoveOperationRequestAsync(id, doctorId);
                return Ok(new { Message = "Operation Request deleted successfully." });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SearchedOperationRequestDTO>>> GetAllOperationRequestsAsync(string patientName, string operationType, string status, string priority)
        {
            var dto = new SearchOperationRequestDTO(patientName, operationType, status, priority);
            try
            {
                var operationRequests = await _service.SearchOperationRequests(dto);
                return Ok(operationRequests);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}