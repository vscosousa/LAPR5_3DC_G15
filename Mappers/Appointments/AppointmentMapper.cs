using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Shared;
using Domain.Appointments;
using Projetos.LAPR5_3DC_G15.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using DDDSample1.Domain.OperationRequests;
using Domain.SurgeryRooms;  // Add this line
using DDDSample1.Domain.Staffs;  // Or whatever the correct namespace is for StaffId

namespace Infrastructure.Appointments
{
    public class AppointmentMapper : IMapper<Appointment, AppointmentDTO, CreatingAppointmentDTO>
    {
        public AppointmentDTO ToDTO(Appointment domain)
        {
            return new AppointmentDTO(
                domain.Id.AsGuid(),
                domain.RequestId.AsGuid(),
                domain.RoomId.AsGuid(),
                domain.Date,
                domain.Status.ToString(),
                domain.AssignedStaff.Select(s => s.AsGuid()).ToList()
            );
        }

        public Appointment ToDomain(CreatingAppointmentDTO dto)
        {
            return new Appointment(
                new AppointmentId(Guid.NewGuid()),
                new OperationRequestId(dto.RequestId.AsGuid()),  
                dto.DateTime,
                new SurgeryRoomId(dto.SurgeryRoomId),
                AppointmentStatus.Scheduled,
                dto.AssignedStaffIds.Select(id => new StaffId(id)).ToList()  // Changed StaffIds to AssignedStaffIds
            );
        }

        public CreatingAppointmentDTO ToCreateDTO(Appointment domain)
        {
            return new CreatingAppointmentDTO
            {
                DateTime = domain.Date,
                RequestId = new OperationRequestId(domain.RequestId.AsGuid()),
                SurgeryRoomId = domain.RoomId.AsGuid(),
                AssignedStaffIds = domain.AssignedStaff.Select(s => s.AsGuid().ToString()).ToList()  // Convert Guid to string
            };
        }

        public CreatingAppointmentDTO ToCreatingDto(Appointment domain)
        {
            throw new NotImplementedException();
        }

        public AppointmentDTO ToDto(Appointment domain)
        {
            throw new NotImplementedException();
        }
    }
}

