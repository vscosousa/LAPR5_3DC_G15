using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;
using Domain.Appointments;
using Domain.SurgeryRooms;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Infrastructure;  // Assuming this is where your DbContext is defined
using DDDSample1.Infrastructure.Shared;  // Add this line at the top with other using statements

namespace Infrastructure.Appointments
{
    public class AppointmentRepository : BaseRepository<Appointment, AppointmentId>, IAppointmentRepository
    {
        private readonly DDDSample1DbContext _context;

        public AppointmentRepository(DDDSample1DbContext context) : base(context.Appointments)
        {
            _context = context;
        }

        public async Task<List<Appointment>> GetByStaffIdAsync(Guid staffId)
        {
            return await _context.Appointments
                .Where(a => a.AssignedStaff.Any(s => s.AsGuid() == staffId))
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetByPatientIdAsync(PatientId patientId)
        {
            return await _context.Appointments
                .Include(a => a.OperationRequest)
                .Where(a => a.OperationRequest.PatientId.Value == patientId.Value)
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetBySurgeryRoomIdAsync(Guid surgeryRoomId)
        {
            return await _context.Appointments
                .Where(a => a.RoomId.AsGuid() == surgeryRoomId)
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetByDateAsync(DateTime date)
        {
            return await _context.Appointments
                .Where(a => a.Date.Date == date.Date)
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetByStaffIdAsync(StaffId staffId)
        {
            return await GetByStaffIdAsync(staffId.AsGuid());
        }

        Task IAppointmentRepository.AddAsync(Appointment appointment)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(AppointmentId id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Appointment>> GetByPatientIdAsync(Guid patientId)
        {
            throw new NotImplementedException();
        }

        public Task<List<Appointment>> GetBySurgeryRoomIdAsync(SurgeryRoomId surgeryRoomId)
        {
            throw new NotImplementedException();
        }

        public Task<List<Appointment>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            throw new NotImplementedException();
        }

        public Task<bool> ExistsConflictingAppointmentAsync(DateTime dateTime, SurgeryRoomId surgeryRoomId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> ExistsConflictingStaffAppointmentAsync(DateTime dateTime, List<string> staffIds)
        {
            throw new NotImplementedException();
        }
    }
}
