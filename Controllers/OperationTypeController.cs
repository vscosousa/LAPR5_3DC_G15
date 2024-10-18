using DDDSample1.Domain.OperationTypes;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypeController : ControllerBase
    {

        private readonly OperationTypeService _operationTypeService;
        public OperationTypeController(OperationTypeService operationTypeService)
        {
            this._operationTypeService = operationTypeService;
        }



        //POST api/operationType
        // US 5.1.20
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<OperationType>> CreateOperationType(CreatingOperationTypeDTO operationTypeDTO) // Change the DTO
        {
            try
            {
                var operationType = await this._operationTypeService.CreateOperationTypeAsync(operationTypeDTO);
                return Ok(operationType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating the operation type: {ex.Message}");
            }
        }

        //PUT api/operationType/update
        // US 5.1.21
        [HttpPut("operationTypeName")]
        [AllowAnonymous]

        public async Task<IActionResult> UpdateOperationType(string operationTypeName, [FromBody] UpdatingOperationTypeDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("OperationType data is required.");
            }

            try
            {
                var updatedOperationType = await _operationTypeService.UpdateOperationTypeAsync(operationTypeName, dto);

                return Ok(updatedOperationType);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating the operation type.", Details = ex.Message });
            }
        }


        // US 5.1.22
        // PUT: api/OperationType/deactivate
        [HttpPut("deactivate")]
        public async Task<IActionResult> DeactivateOperationType([FromBody] string operationName)
        {
            try
            {
                await _operationTypeService.DeactivateOperationTypeAsync(operationName);
                return Ok($"OperationType '{operationName}' has been successfully deactivated.");
            }
            catch (KeyNotFoundException ex)
            {
                // Return a 404 if the operation type was not found
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                // Return a 400 if the operation type is already deactivated or other invalid operation
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                // Return a 400 for invalid input
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Return a 500 for any other unhandled errors
                return StatusCode(500, new { message = "An error occurred while deactivating the operation type.", error = ex.Message });
            }
        }

        // US 5.1.22
        // PUT: api/OperationType/activate
        [HttpPut("activate")]
        public async Task<IActionResult> ActivateOperationType([FromBody] string operationName)
        {
            try
            {
                await _operationTypeService.ActivateOperationTypeAsync(operationName);
                return Ok($"OperationType '{operationName}' has been successfully deactivated.");
            }
            catch (KeyNotFoundException ex)
            {
                // Return a 404 if the operation type was not found
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                // Return a 400 if the operation type is already deactivated or other invalid operation
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                // Return a 400 for invalid input
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Return a 500 for any other unhandled errors
                return StatusCode(500, new { message = "An error occurred while deactivating the operation type.", error = ex.Message });
            }
        }





        // GET: api/OperationType
        //US 5.1.23
        [HttpGet("id")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOperationType(Guid id)
        {
            try
            {
                var operationType = await _operationTypeService.GetOperationTypeWithStaffsAsync(new OperationTypeId(id));
                return Ok(operationType);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving the operation type: {ex.Message}");
            }
        }

        //Get OperationType by status
        // US 5.1.23
        // GET: api/OperationType/status
        [HttpGet("status")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOperationTypeByStatus(bool status)
        {
            try
            {
                var operationType = await _operationTypeService.GetOperationTypesByStatusAsync(status);
                return Ok(operationType);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving the operation type: {ex.Message}");
            }
        }

        //Get OperationType by name
        // US 5.1.23
        // GET: api/OperationType/name
        [HttpGet("name")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOperationTypeByName(string name)
        {
            try
            {
                var operationType = await _operationTypeService.GetOperationTypesByNameAsync(name);
                return Ok(operationType);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving the operation type: {ex.Message}");
            }
        }

        // Get all OperationTypes
        // GET: api/OperationType
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllOperationTypes()
        {
            try
            {
                var operationTypes = await _operationTypeService.GetAllOperationsTypeAsync();
                return Ok(operationTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving the operation types: {ex.Message}");
            }
        }
    }
}