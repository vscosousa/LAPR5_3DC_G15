using System;
using System.Threading.Tasks;

namespace DDDSample1.Services
{
    public interface IEmailService
    {
        Task SendDeletionConfirmationEmail(string email, string confirmationToken, DateTime expiryDate);
        Task SendEmailVerificationRequest(string email, string verificationToken, DateTime expiryDate);
    }

}
