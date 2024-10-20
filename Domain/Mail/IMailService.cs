using System.Threading.Tasks;

public interface IMailService
{
    Task SendEmail(string toEmail, string username, string activationLink);
}
