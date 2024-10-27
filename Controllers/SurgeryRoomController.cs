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
    }
}