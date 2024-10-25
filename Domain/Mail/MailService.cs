using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

public class MailService : IMailService
{
    private readonly IConfiguration _configuration;

    public MailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmail(string toEmail, string username, string activationLink)
    {
        var smtpClient = new SmtpClient
        {
            Host = _configuration["SmtpSettings:Server"],
            Port = int.Parse(_configuration["SmtpSettings:Port"]),
            EnableSsl = true, // Set to false for Papercut
            Credentials = new NetworkCredential(_configuration["SmtpSettings:Username"], _configuration["SmtpSettings:Password"]) // Remove this line
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_configuration["SmtpSettings:SenderEmail"], _configuration["SmtpSettings:SenderName"]),
            Subject = "Activate your account",
            Body = $"Hi {username}, please activate your account by clicking this link: {activationLink}",
            IsBodyHtml = true,
        };

        mailMessage.To.Add(toEmail);

        await smtpClient.SendMailAsync(mailMessage);
    }

    public async Task SendEmailToAdminAsync(string adminEmail, string subject, string message)
    {
        try
        {
            var smtpClient = new SmtpClient
            {
                Host = _configuration["SmtpSettings:Server"],
                Port = int.Parse(_configuration["SmtpSettings:Port"]),
                EnableSsl = true, // Set to false for Papercut
                Credentials = new NetworkCredential(_configuration["SmtpSettings:Username"], _configuration["SmtpSettings:Password"]) // Remove this line
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["SmtpSettings:SenderEmail"], _configuration["SmtpSettings:SenderName"]),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };

            mailMessage.To.Add(adminEmail);

            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to send email: " + ex.Message);
        }
    }

    public async Task SendResetPasswordEmailAsync(string email, string username, string resetLink)
    {
        var smtpClient = new SmtpClient
        {
            Host = _configuration["SmtpSettings:Server"],
            Port = int.Parse(_configuration["SmtpSettings:Port"]),
            EnableSsl = true, // Set to false for Papercut
            Credentials = new NetworkCredential(_configuration["SmtpSettings:Username"], _configuration["SmtpSettings:Password"]) // Remove this line
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_configuration["SmtpSettings:SenderEmail"], _configuration["SmtpSettings:SenderName"]),
            Subject = "Reset your password",
            Body = $"Hi {username}, please reset your password by clicking this link: {resetLink}",
            IsBodyHtml = true,
        };

        mailMessage.To.Add(email);

        await smtpClient.SendMailAsync(mailMessage);
    }
}
