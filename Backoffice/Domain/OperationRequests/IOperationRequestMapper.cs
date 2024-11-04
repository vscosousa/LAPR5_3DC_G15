using DDDSample1.Domain.Patients;
using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace DDDSample1.Domain.OperationRequests
{
    public interface IOperationRequestMapper : IMapper<OperationRequest, OperationRequestDTO, CreatingOperationRequestDTO>
    {
        SearchedOperationRequestDTO ToSeachedDTO(OperationRequest input, string patientName);
    }
}