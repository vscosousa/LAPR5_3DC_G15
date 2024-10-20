using System;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public interface IPatientRepository : IRepository<Patient, PatientId>
    {
        Task<IQueryable<Patient>> GetByDateOfBirthAsync(DateOnly dateTime);
        Task<IQueryable<Patient>> GetByFirstNameAsync(string firstName);
        Task<IQueryable<Patient>> GetByFullNameAsync(string fullName);
        Task<IQueryable<Patient>> GetByLastNameAsync(string lastName);
        Task<IQueryable<Patient>> GetByGenderAsync(string gender);
        Task<IQueryable<Patient>> GetByMedicalRecordNumberAsync(string medicalRecordNumber);
        Task<IQueryable<Patient>> GetQueriableByEmailAsync(string email);
        Task<IQueryable<Patient>> GetQueriableByPhoneNumberAsync(string phoneNumber);
        Task<Patient> GetByEmailAsync(string email);
        Task<Patient> GetByPhoneNumberAsync(string phoneNumber);
    }
}