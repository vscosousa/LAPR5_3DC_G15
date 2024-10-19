using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Logs
{
    public interface ILogRepository : IRepository<Log, LogId>
    {
    }
}