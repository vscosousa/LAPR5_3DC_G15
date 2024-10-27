using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;
using Domain.SurgeryRooms;

namespace Domain.Appointments
{
    public interface IAppointmentRepository : IRepository<Appointment, AppointmentId>
    {
        new Task<Appointment> GetByIdAsync(AppointmentId id);
        new Task<List<Appointment>> GetAllAsync();
        new Task AddAsync(Appointment appointment);
        new Task UpdateAsync(Appointment appointment);
        Task DeleteAsync(AppointmentId id);
        Task<List<Appointment>> GetByStaffIdAsync(Guid staffId);
        Task<List<Appointment>> GetByPatientIdAsync(Guid patientId);
        Task<List<Appointment>> GetBySurgeryRoomIdAsync(Guid surgeryRoomId);
        Task<List<Appointment>> GetByDateAsync(DateTime date);
        Task<List<Appointment>> GetByStaffIdAsync(StaffId staffId);
        Task<List<Appointment>> GetByPatientIdAsync(PatientId patientId);
        Task<List<Appointment>> GetBySurgeryRoomIdAsync(SurgeryRoomId surgeryRoomId);
        Task<List<Appointment>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<bool> ExistsConflictingAppointmentAsync(DateTime dateTime, SurgeryRoomId surgeryRoomId);
        Task<bool> ExistsConflictingStaffAppointmentAsync(DateTime dateTime, List<string> staffIds);
    }
}
