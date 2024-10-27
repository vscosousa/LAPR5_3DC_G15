using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using Domain.SurgeryRooms;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Staffs; // Add this using statement

namespace Domain.Appointments
{
    public enum AppointmentStatus
    {
        Scheduled,
        Completed,
        Canceled
    }

    public class Appointment : Entity<AppointmentId>, IAggregateRoot
    {
        public new AppointmentId Id { get; private set; }
        public OperationRequestId RequestId { get; private set; }  
        public SurgeryRoomId RoomId { get; private set; }
        public DateTime Date { get; private set; }
        public AppointmentStatus Status { get; private set; }
        public ICollection<StaffId> AssignedStaff { get; private set; }  
        public virtual OperationRequest OperationRequest { get; set; }

    
        private Appointment() { } 

        public Appointment(AppointmentId id, OperationRequestId requestId, DateTime date,SurgeryRoomId roomId,  AppointmentStatus status, ICollection<StaffId> assignedStaff)
        {
            Id = id;
            RequestId = requestId;
            RoomId = roomId;
            Date = date;
            Status = status;
            AssignedStaff = assignedStaff;
        }

        public void UpdateStatus(AppointmentStatus newStatus)
        {
            Status = newStatus;
        }

        public void RescheduleTo(DateTime newDateAndTime)
        {
            Date = newDateAndTime;
        }

        public void AssignSurgeryRoom(SurgeryRoomId newRoomId)
        {
            RoomId = newRoomId;
        }

        public void AddStaffMember(StaffId staffId)
        {
            AssignedStaff.Add(staffId);
        }

        public void RemoveStaffMember(StaffId staffId)
        {
            AssignedStaff.Remove(staffId);
        }

        public void UpdateAssignedStaff(ICollection<StaffId> newStaffIds)
        {
            AssignedStaff = newStaffIds;
        }
    }
}
