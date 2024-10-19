using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Patients
{
    public class PatientRepository : BaseRepository<Patient, PatientId>,IPatientRepository
    {
        public PatientRepository(DDDSample1DbContext context):base(context.Patients)
        {
           
        }

        public async Task<Patient> GetUserByEmailAsync(string email)
        {
            return await _objs.Where(x => email.Equals(x.Email)).FirstOrDefaultAsync();
        }

        public Task<Patient> GetUserByPhoneNumberAsync(string phoneNumber)
        {
            return _objs.Where(x => phoneNumber.Equals(x.PhoneNumber)).FirstOrDefaultAsync();
        }
    }
}