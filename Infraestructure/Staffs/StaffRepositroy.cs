using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Staffs;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.Specializations;
using System.Linq;
using System;

namespace DDDSample1.Infrastructure.Staffs
{
    public class StaffRepository : BaseRepository<Staff, StaffId>, IStaffRepository
    {
        public StaffRepository(DDDSample1DbContext context) : base(context.Staffs)
        {
        }

        public async Task<IEnumerable<Staff>> GetStaffBySpecializationIdAsync(SpecializationId specializationId)
        {
            return await _objs.Where(s => s.SpecializationId == specializationId).ToListAsync();
        }

        public async Task<Staff> GetByEmailAsync(string email)
        {
            return await _objs.Where(x => email.Equals(x.Email)).FirstOrDefaultAsync();
        }

        public async Task<Staff> GetByPhoneNumberAsync(string phoneNumber)
        {
            return await _objs.Where(x => phoneNumber.Equals(x.PhoneNumber)).FirstOrDefaultAsync();
        }

        public async Task<Staff> GetByLicenseNumberAsync(string licenseNumber)
        {
            return await _objs.Where(x => licenseNumber.Equals(x.LicenseNumber)).FirstOrDefaultAsync();
        }

        public async Task<List<Staff>> SearchStaffAsync(SearchStaffDTO dto)
        {
            var query = _objs.AsQueryable();

            if (!string.IsNullOrEmpty(dto.FirstName))
            {
                query = query.Where(s => s.FirstName.Contains(dto.FirstName));
            }

            if (!string.IsNullOrEmpty(dto.LastName))
            {
                query = query.Where(s => s.LastName.Contains(dto.LastName));
            }

            if (!string.IsNullOrEmpty(dto.FullName))
            {
                query = query.Where(s => s.FullName.Contains(dto.FullName));
            }

            if (!string.IsNullOrEmpty(dto.Email))
            {
                query = query.Where(s => s.Email.Contains(dto.Email));
            }

            if (!string.IsNullOrEmpty(dto.SpecializationName))
            {
                query = query.Where(s => s.SpecializationId == new SpecializationId(dto.SpecializationId));
            }

            return await query.ToListAsync();
        }
    }
}