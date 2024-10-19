using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public interface IPatientRepository : IRepository<Patient, PatientId>
    {
        Task<Patient> GetUserByEmailAsync(string email);
        Task<Patient> GetUserByPhoneNumberAsync(string phoneNumber);
    }
}