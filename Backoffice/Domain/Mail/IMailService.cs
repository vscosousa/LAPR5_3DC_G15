using System.Threading.Tasks;
using DDDSample1.Domain.Staffs;

public interface IMailService
{
    Task SendEmail(string toEmail, string username, string activationLink);
    Task SendEmailToAdminAsync(string adminEmail, string subject, string message);
    Task SendResetPasswordEmailAsync(string email, string username, string resetLink);
    Task SendEmailToStaff(string email, string username, UpdateStaffDTO dto, string activationLink);
    Task SendDeletePatientUserEmailAsync(string email, string name, string deleteLink);
    Task SendUpdateProfileAsync(string email, string name, string updateLink);
}