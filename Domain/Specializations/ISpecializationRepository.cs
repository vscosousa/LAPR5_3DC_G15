using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Specializations
{
    public interface ISpecializationRepository : IRepository<Specialization, SpecializationId>
    {
        Task<Specialization> GetByIdSpecAsync(SpecializationId id, bool includeStaff);
        Task<Specialization> GetSpecIdByOptionAsync(string option);
    }
}