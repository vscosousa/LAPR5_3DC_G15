using DDDSample1.Domain.Specializations;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Specializations
{
    public class SpecializationRepository : BaseRepository<Specialization, SpecializationId>, ISepcializationRepository
    {
        public SpecializationRepository(DDDSample1DbContext context) : base(context.Specializations)
        {
        }
    }
}
