using System.Threading.Tasks;
using DDDSample1.Domain.Logs;

namespace DDDSample1.Services
{
    public interface IAuditLogService
    {
        Task LogAsync(AuditLog log);
    }
}