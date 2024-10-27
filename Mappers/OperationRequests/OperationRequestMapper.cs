using DDDSample1.Domain.OperationRequests;
using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace DDDSample1.Mappers.OperationRequests
{
    public class OperationRequestMapper : IMapper<OperationRequest, OperationRequestDTO, CreatingOperationRequestDTO>
    {
        public OperationRequestDTO ToDto(OperationRequest domain)
        {
            return new OperationRequestDTO(domain.Id.AsGuid(), domain.PatientId.ToString(), domain.StaffId.ToString(), 
                domain.OperationTypeId.ToString(), domain.Deadline, domain.Priority, domain.CreatedAt, domain.Status, 
                domain.Patient);
        }

        public OperationRequest ToDomain(CreatingOperationRequestDTO dto)
        {
            return new OperationRequest(dto.OperationTypeId);
        }

        public CreatingOperationRequestDTO ToCreatingDto(OperationRequest domain)
        {
            return new CreatingOperationRequestDTO(domain.OperationTypeId.ToString());
        }
    }
}
