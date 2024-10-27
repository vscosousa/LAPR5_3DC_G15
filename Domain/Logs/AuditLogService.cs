using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Logs;

namespace DDDSample1.Services
{
    public class AuditLogService : IAuditLogService
    {
        public async Task LogAsync(AuditLog log)
        {
            // Assuming AuditLog has LogAction instead of Action
            Console.WriteLine($"Audit Log: {log.TypeOfAction} by {log.EntityId} at {log.DateTime}");
            await Task.CompletedTask;
        }
    }
}
