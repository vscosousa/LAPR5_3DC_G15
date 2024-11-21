using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [Authorize (Roles = "Admin")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly AppointmentService _service;

        public AppointmentController(AppointmentService operationRequestService)
        {
            _service = operationRequestService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<AppointmentDTO>> PostAppointment(CreatingAppointmentDTO dto)
        {
            try
            {
                var appointment = await _service.CreateAppointment(dto);
                return Ok(appointment);
            }
            catch (BusinessRuleValidationException e)
            {
                return BadRequest(new { Message = e.Message });
            }
            catch (SystemException)
            {
                return StatusCode(500, new { Message = "An error occurred while creating the appointment." });
            }
        }
    }
}