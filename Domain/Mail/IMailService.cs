using System.Threading.Tasks;

public interface IMailService
{
    Task SendActivationEmail(string toEmail, string username, string activationLink);
}
