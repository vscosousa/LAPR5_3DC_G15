using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.User
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        private readonly IMailService _mailService; 
         private readonly IUnitOfWork _unitOfWork;
        
         

        public UserService(IUserRepository userRepository, IMailService mailService, IUnitOfWork unitOfWork) 
        {
            _userRepository = userRepository;
            _mailService = mailService; 
            _unitOfWork = unitOfWork;
        }

        // Create a user
       public async Task<User> CreateUser(CreatingUserDTO dto)
        {
            try
            {
                var username = dto.Username;
                var email = dto.Email;
                var role = (Role)Enum.Parse(typeof(Role), dto.Role, true);
               
                var user = new User(email,username,role);

                await _userRepository.AddAsync(user);
                await _unitOfWork.CommitAsync();
                Console.WriteLine("Transaction committed successfully");

                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        private string GenerateActivationLink(Guid userId)
        {
           
            return $"https://yourapp.com/activate?userId={userId}&token=your-activation-token";
        }
    }
}
