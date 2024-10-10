using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Specializations
{
    public interface ISepcializationRepository : IRepository<Specialization, SpecializationId>
    {
    }
}