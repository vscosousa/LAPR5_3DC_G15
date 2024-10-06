using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public interface IPatientRepository : IRepository<Patient, PatientId>
    {
    }
}