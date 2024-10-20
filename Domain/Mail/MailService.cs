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
            EnableSsl = bool.Parse(_configuration["SmtpSettings:EnableSsl"]),
            Credentials = new NetworkCredential(_configuration["SmtpSettings:Username"], _configuration["SmtpSettings:Password"])
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
}