using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [Authorize (Roles = "Admin")]
    [ApiController]
    public class SurgeryRoomController : ControllerBase
    {
        private readonly SurgeryRoomService _service;

        public SurgeryRoomController(SurgeryRoomService surgeryRoomService)
        {
            _service = surgeryRoomService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<SurgeryRoomDTO>> PostSurgeryRoom(CreatingSurgeryRoomDTO dto)
        {
            try
            {
                var surgeryRoom = await _service.CreateSurgeryRoom(dto);
                return Ok(surgeryRoom);
            }
            catch (BusinessRuleValidationException e)
            {
                return BadRequest(new { Message = e.Message });
            }
            catch (SystemException)
            {
                return StatusCode(500, new { Message = "An error occurred while creating the surgery room." });
            }
        }


        // GET: api/SurgeryRoom/GetRoomsByDate?date=
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<SurgeryRoomDTO>> GetRoomsByDate(DateTime date)
        {
            try
            {
                var rooms = await _service.GetRoomsByDate(date);
                return Ok(rooms);
            }
            catch (BusinessRuleValidationException e)
            {
                return BadRequest(new { Message = e.Message });
            }
            catch (SystemException)
            {
                return StatusCode(500, new { Message = "An error occurred while getting the surgery rooms." });
            }
        }
    }
}