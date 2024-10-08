using System;
using System.Threading.Tasks;
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
        // POST api/operationType
        // US 5.1.20
        [HttpPost]
        public async Task<ActionResult<OperationType>> CreateOperationType(CreatingOperationTypeDTO operationTypeDTO) // Change the DTO
        {
            try
            {
            var operationType = await this._operationTypeService.CreateOperationType(operationTypeDTO);
            return Ok(operationType);
            }
            catch (Exception ex)
            {
            return StatusCode(500, $"An error occurred while creating the operation type: {ex.Message}");
            }
        }
    }
}