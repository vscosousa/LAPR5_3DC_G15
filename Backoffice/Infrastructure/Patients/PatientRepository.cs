using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Patients
{
    public class PatientRepository : BaseRepository<Patient, PatientId>, IPatientRepository
    {
        public PatientRepository(DDDSample1DbContext context) : base(context.Patients)
        {
        }

        public async Task<Patient> GetByEmailAsync(string email)
        {
            return await _objs.Where(x => email.Equals(x.Email)).FirstOrDefaultAsync();
        }

        public Task<Patient> GetByMedicalRecordNumberAsync(string medicalRecordNumber)
        {
            return _objs.Where(x => medicalRecordNumber.Equals(x.MedicalRecordNumber)).FirstOrDefaultAsync();
        }

        public async Task<Patient> GetByPhoneNumberAsync(string phoneNumber)
        {
            return await _objs.Where(x => phoneNumber.Equals(x.PhoneNumber)).FirstOrDefaultAsync();
        }
        public async Task<List<Patient>> SearchPatientsAsync(SearchPatientDTO dto)
        {
            var query = _objs.AsQueryable();

            if (!string.IsNullOrEmpty(dto.FirstName))
                query = query.Where(p => p.FirstName == dto.FirstName);

            if (!string.IsNullOrEmpty(dto.LastName))
                query = query.Where(p => p.LastName == dto.LastName);

            if (!string.IsNullOrEmpty(dto.FullName))
                query = query.Where(p => p.FullName == dto.FullName);

            if (!string.IsNullOrEmpty(dto.DateOfBirth))
            {
                var dateOfBirth = DateOnly.Parse(dto.DateOfBirth);
                query = query.Where(p => p.DateOfBirth == dateOfBirth);
            }

            if (!string.IsNullOrEmpty(dto.Gender))
                if (Enum.TryParse<GenderOptions>(dto.Gender, out var gender))
                    query = query.Where(p => p.GenderOptions == gender);

            if (!string.IsNullOrEmpty(dto.MedicalRecordNumber))
                query = query.Where(p => p.MedicalRecordNumber == dto.MedicalRecordNumber);

            if (!string.IsNullOrEmpty(dto.Email))
                query = query.Where(p => p.Email == dto.Email);

            if (!string.IsNullOrEmpty(dto.PhoneNumber))
                query = query.Where(p => p.PhoneNumber == dto.PhoneNumber);

            return await query.ToListAsync();
        }
    }
}