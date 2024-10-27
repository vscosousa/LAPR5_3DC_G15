using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using DDDSample1.Domain.OperationRequests;
namespace DDDSample1.Domain.Appointments
{
    public class CreatingAppointmentDTO
    {
        [Required]
        public DateTime DateTime { get; set; }

        [Required]
        public Guid PatientId { get; set; }

        [Required]
        public Guid StaffId { get; set; }

        [Required]
        public Guid SurgeryRoomId { get; set; }

        public OperationRequestId RequestId { get; set; }

        public List<string> AssignedStaffIds { get; set; }  


        public CreatingAppointmentDTO() { }
    }
}
