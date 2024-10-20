using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DDDSample1.Domain.Logs;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;


namespace DDDSample1.Domain.Users
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMailService _mailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IPatientRepository _patientRepository;
        private readonly ILogRepository _logRepository; 

        public UserService(IUserRepository userRepository, IMailService mailService, IUnitOfWork unitOfWork, IConfiguration configuration, IPatientRepository patientRepository, ILogRepository logRepository)
        {
            _userRepository = userRepository;
            _mailService = mailService;
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _patientRepository = patientRepository;
            _logRepository = logRepository;
        }

        // Create a user
        public async Task<User> CreateUser(CreatingUserDTO dto)
        {
            try
            {
                // Check if email is already in use
                var existingUserByEmail = await _userRepository.GetUserByEmailAsync(dto.Email);
                if (existingUserByEmail != null)
                {
                    throw new Exception("Email is already in use.");
                }

                // Check if username is already in use
                var existingUserByUsername = await _userRepository.GetUserByUsernameAsync(dto.Username);
                if (existingUserByUsername != null)
                {
                    throw new Exception("Username is already in use.");
                }

                // Parse the role and create the user
                var role = Enum.Parse<Role>(dto.Role, true);
                var user = new User(dto.Email, dto.Username, role);


                string token = CreateToken(user);


                await _mailService.SendEmail(dto.Email, "Activate your account", GenerateLink(token, "Activate"));


                await _userRepository.AddAsync(user);
                await _unitOfWork.CommitAsync();

                return user;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<User> CreateUserAsPatient(CreatingPatientUserDTO dto)
        {
            // Check if email is already in use
            var existingUserByEmail = await _userRepository.GetUserByEmailAsync(dto.Email);
            if (existingUserByEmail != null && existingUserByEmail.IsActive)
            {
                throw new Exception("Email is already in use.");
            }

            if (existingUserByEmail != null && existingUserByEmail.PhoneNumber != dto.PhoneNumber)
            {
                throw new Exception("Phone number does not match the Patient's email.");
            }

            var patient = await _patientRepository.GetByEmailAsync(dto.Email);

            var role = Enum.Parse<Role>(dto.Role, true);
            var user = new User(dto.Email, dto.PhoneNumber, role, dto.Password, patient.Id.AsGuid());
            string token = CreateToken(user);

            await _mailService.SendEmail(dto.Email, "Activate your account", GenerateLink(token, "ActivatePatientUser"));
            await _userRepository.AddAsync(user);
            await _unitOfWork.CommitAsync();

            return user;

        }


        // Activate a user and set the password
        public async Task<User> ActivateUser(string token, string newPassword)
        {

            var userId = VerifyToken(token) ?? throw new Exception("Invalid or expired token.");
            var user = await _userRepository.GetByIdAsync(userId) ?? throw new Exception("User not found.");
            user.SetPassword(newPassword);

            await _userRepository.UpdateAsync(user);
            await _unitOfWork.CommitAsync();

            return user;
        }

        public async Task<User> ActivateUserAsPatient(string token)
        {
            var userId = VerifyToken(token);
            if (userId == null)
            {
                throw new Exception("Invalid or expired token.");
            }

            var user = await _userRepository.GetByIdAsync(userId) ?? throw new Exception("User not found.");
            user.Activate();

            await _userRepository.UpdateAsync(user);
            await _unitOfWork.CommitAsync();

            return user;
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.AsGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: cred
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private UserID VerifyToken(string token)
        {
            try
            {

                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]))
                };


                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);


                if (validatedToken is not JwtSecurityToken jwtToken ||
                    !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    throw new SecurityTokenException("Invalid token");
                }

                var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier) ?? throw new Exception("User ID not found in token.");
                if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                {
                    throw new Exception("Invalid user ID in token.");
                }

                return new UserID(userId);
            }
            catch (SecurityTokenException ex)
            {

                throw new SecurityTokenException("Token validation failed: " + ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred during token validation: " + ex.Message);
            }
        }

        private static string GenerateLink(string token, string typeOfLink)
        {
            return $"https://localhost:5001/{typeOfLink}?token={token}";
        }


        public async Task<string> Login(LoginUserDTO dto)
        {

            var user = await _userRepository.GetUserByEmailAsync(dto.Email) ?? throw new Exception("Email not registered");
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                throw new Exception("Wrong password");
            }

            string output = "User logged in successfully";
            string token = CreateToken(user);
            output += $"\n\nToken: {token}";

            return output;
        }

        public async Task RequestDelete(string token)
        {
            try{
                var userId = VerifyToken(token) ?? throw new Exception("Invalid or expired token.");
                var user = await _userRepository.GetByIdAsync(userId);

                await _mailService.SendEmail(user.Email, "Delete User Request", GenerateLink(token, "DeleteUser"));
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteUser(string token)
        {
            try{
                var userId = VerifyToken(token) ?? throw new Exception("Invalid or expired token.");
                var user = await _userRepository.GetByIdAsync(userId);

                _userRepository.Remove(user);
                
                var log = new Log(TypeOfAction.Delete, userId.ToString(), "User of Type" + user.Role + " deleted.");
                await _logRepository.AddAsync(log);

                await _unitOfWork.CommitAsync();
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
