using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public interface IPatientMapper : IMapper<Patient, PatientDTO, CreatingPatientDTO>
    {
    }
}