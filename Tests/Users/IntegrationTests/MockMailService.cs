using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;

public class MockMailService : IMailService
{
    public List<MailMessage> SentEmails { get; } = new List<MailMessage>();

    public Task SendEmail(string toEmail, string username, string activationLink)
    {
        var mailMessage = CreateMailMessage(toEmail, username, activationLink, "Activate your account");
        SentEmails.Add(mailMessage);
        return Task.CompletedTask; 
    }

    public Task SendEmailToAdminAsync(string adminEmail, string subject, string message)
    {
        var mailMessage = CreateMailMessage(adminEmail, "Admin", null, subject, message);
        SentEmails.Add(mailMessage);
        return Task.CompletedTask;
    }

    public Task SendResetPasswordEmailAsync(string email, string username, string resetLink)
    {
        var mailMessage = CreateMailMessage(email, username, resetLink, "Reset your password");
        SentEmails.Add(mailMessage);
        return Task.CompletedTask;
    }

    
    private MailMessage CreateMailMessage(string toEmail, string username, string link, string subject, string body = null)
    {
        return new MailMessage
        {
            From = new MailAddress("test@example.com", "Test Sender"), // Use a dummy sender for testing
            To = { toEmail },
            Subject = subject,
            Body = body ?? $"Hi {username}, please activate your account by clicking this link: {link}",
            IsBodyHtml = true
        };
    }
}
