using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Patients
{
    public class PatientRepository : BaseRepository<Patient, PatientId>,IPatientRepository
    {
        public PatientRepository(DDDSample1DbContext context):base(context.Patients)
        {
           
        }
    }
}