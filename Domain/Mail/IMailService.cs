using System.Threading.Tasks;

public interface IMailService
{
    Task SendEmail(string toEmail, string username, string activationLink);
    Task SendEmailToAdminAsync(string adminEmail, string subject, string message);
    Task SendResetPasswordEmailAsync(string email, string username, string resetLink);
}