
using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;
using DDDSample1.Domain.Staffs;
using Microsoft.Extensions.Configuration;

public class MockMailService : IMailService
{
    private readonly IConfiguration _configuration;
    public List<MailMessage> SentEmails { get; } = new List<MailMessage>();

    public MockMailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

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

    public Task SendEmailToStaff(string email, string username, UpdateStaffDTO dto, string activationLink)
    {
        var message = new List<string>();
        if (!string.IsNullOrEmpty(dto.PhoneNumber))
        {
            message.Add($"your phone number has been updated to {dto.PhoneNumber}");
        }
        if (!string.IsNullOrEmpty(dto.Email))
        {
            message.Add($"your email has been updated to {dto.Email}");
        }
        var body = $"Hi {username}, " + string.Join(" and ", message) + $", please click here to confirm: {activationLink}";
        var mailMessage = CreateMailMessage(email, username, activationLink, "Update Phone Number Staff", body);

        mailMessage.To.Add(email);
        SentEmails.Add(mailMessage);
        return Task.CompletedTask;
    }

    private MailMessage CreateMailMessage(string toEmail, string username, string link, string subject, string body = null)
    {
        return new MailMessage
        {
            From = new MailAddress(_configuration["SmtpSettings:SenderEmail"], _configuration["SmtpSettings:SenderName"]),
            To = { toEmail },
            Subject = subject,
            Body = body ?? $"Hi {username}, please activate your account by clicking this link: {link}",
            IsBodyHtml = true
        };
    }
}