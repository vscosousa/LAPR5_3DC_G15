using System;
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

        public async Task<IQueryable<Patient>> GetByDateOfBirthAsync(DateOnly dateOfBirth)
        {
            return await Task.FromResult(_objs.Where(p => p.DateOfBirth == dateOfBirth));
        }

        public async Task<IQueryable<Patient>> GetByFirstNameAsync(string firstName)
        {
            return await Task.FromResult(_objs.Where(p => p.FirstName.ToLower().Contains(firstName.ToLower())));
        }

        public async Task<IQueryable<Patient>> GetByFullNameAsync(string fullName)
        {
            return await Task.FromResult(_objs.Where(p => p.FullName.ToLower().Contains(fullName.ToLower())));
        }

        public async Task<IQueryable<Patient>> GetByLastNameAsync(string lastName)
        {
            return await Task.FromResult(_objs.Where(p => p.LastName.ToLower().Contains(lastName.ToLower())));
        }

        public async Task<IQueryable<Patient>> GetByGenderAsync(string gender)
        {
            return await Task.FromResult(_objs.Where(p => p.GenderOptions.ToString().ToLower().Equals(gender.ToLower())));
        }

        public async Task<IQueryable<Patient>> GetByMedicalRecordNumberAsync(string medicalRecordNumber)
        {
            return await Task.FromResult(_objs.Where(p => p.MedicalRecordNumber.ToLower().Contains(medicalRecordNumber.ToLower())));
        }

        public async Task<IQueryable<Patient>> GetQueriableByEmailAsync(string email)
        {
            return await Task.FromResult(_objs.Where(p => p.Email.ToLower().Contains(email.ToLower())));
        }

        public async Task<IQueryable<Patient>> GetQueriableByPhoneNumberAsync(string phoneNumber)
        {
            return await Task.FromResult(_objs.Where(p => p.PhoneNumber.ToLower().Contains(phoneNumber.ToLower())));
        }

        public async Task<Patient> GetByEmailAsync(string email)
        {
            return await _objs.Where(x => email.Equals(x.Email)).FirstOrDefaultAsync();
        }

        public async Task<Patient> GetByPhoneNumberAsync(string phoneNumber)
        {
            return await _objs.Where(x => phoneNumber.Equals(x.PhoneNumber)).FirstOrDefaultAsync();
        }
    }
}