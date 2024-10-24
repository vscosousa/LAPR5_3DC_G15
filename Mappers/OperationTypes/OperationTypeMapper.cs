using System.Linq;
using Projetos.LAPR5_3DC_G15.Mappers.Staffs;
using DDDSample1.Domain.OperationTypes;
using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace DDDSample1.Mappers.OperationTypes
{
    public class OperationTypeMapper : IMapper<OperationType, OperationTypeDTO, CreatingOperationTypeDTO>, IOperationTypeMapper
    {
        public OperationTypeDTO ToDto(OperationType domain)
        {
            return new OperationTypeDTO(
                domain.Id.AsGuid(),
                domain.Name,
                domain.EstimatedDuration,
                domain.Specializations.Select(s => s.Id.AsGuid()).ToList(),
                domain.Staffs.Select(s => new StaffMapper().ToDto(s)).ToList()
            );
        }

        public OperationType ToDomain(CreatingOperationTypeDTO dto)
        {
            return new OperationType(
                dto.Name,
                dto.EstimatedDuration
            );
        }

        public CreatingOperationTypeDTO ToCreatingDto(OperationType domain)
        {
            return new CreatingOperationTypeDTO(
                domain.Name,
                domain.EstimatedDuration,
                domain.Specializations.Select(s => s.Id.AsGuid()).ToList()
            );
        }
    }
}