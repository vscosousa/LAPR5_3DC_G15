using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDD.sample1.Domain.Staffs;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Staffs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {

        private readonly StaffService _staffService;
        public StaffController(StaffService staffService)
        {
            this._staffService = staffService;
        }

        // POST api/staff
    /*    [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Staff>> CreateStaff(CreatingStaffDTO staffDTO)
        {
            try
            {
                var staff = await this._staffService.CreateStaff(staffDTO);
                return Ok(staff);


            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating the staff: {ex.Message}");
            }
        }

        // GET api/specialization/{id}/staffs
        [HttpGet("{id}/staffs")]
        [AllowAnonymous]
        public async Task<ActionResult<ICollection<StaffDTO>>> GetStaffsBySpecialization(Guid id)
        {
            try
            {
                var staffs = await _staffService.GetStaffsBySpecialization(new SpecializationId(id));
                return Ok(staffs);
            }
            catch (BusinessRuleValidationException ex)
            {
                return NotFound(ex.Message);
            }
        }*/
    }
}