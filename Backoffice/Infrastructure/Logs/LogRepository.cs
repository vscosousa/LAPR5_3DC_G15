using DDDSample1.Domain.Logs;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Patients
{
    public class LogRepository : BaseRepository<Log, LogId>,ILogRepository
    {
        public LogRepository(DDDSample1DbContext context):base(context.Logs)
        {
           
        }
    }
}