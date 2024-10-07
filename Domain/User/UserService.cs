using System;
using System.Threading.Tasks;
using DDDSample1.Domain.ValueObjects;


namespace DDDSample1.Domain.User
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        private readonly IMailService _mailService; 
        
         

        public UserService(IUserRepository userRepository, IMailService mailService) 
        {
            _userRepository = userRepository;
            _mailService = mailService; 
        }

        // Create a user
            public async Task<UserDTO> CreateUser(Email email, Username username, string role)
        {
            Role userRole = string.IsNullOrEmpty(role) || role.Equals("Patient", StringComparison.OrdinalIgnoreCase)
                ? Role.FromString("Patient")
                : Role.FromString(role);

            var user = new User(email, username, userRole);

           // await _userRepository.AddAsync(user);
           // await _userRepository.SaveChangesAsync();

            
            string activationLink = GenerateActivationLink(user.Id.AsGuid());

            // Send activation email
            await _mailService.SendActivationEmail(email.EmailValue, username.Value, activationLink);

            
            return new UserDTO(user); 
        }


        private string GenerateActivationLink(Guid userId)
        {
           
            return $"https://yourapp.com/activate?userId={userId}&token=your-activation-token";
        }
    }
}
