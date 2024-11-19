using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DDDSample1.Domain.Logs;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Shared;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http.HttpResults;
using Xunit.Sdk;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.VisualStudio.TestPlatform.ObjectModel.Client.Payloads;
using Google.Apis.Auth;
using System.Web;


namespace DDDSample1.Domain.Users
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMailService _mailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IPatientRepository _patientRepository;
        private readonly IStaffRepository _staffRepository;
        private readonly ILogRepository _logRepository;

        private readonly IUserMapper _userMapper;

        public UserService(IUserRepository userRepository, IMailService mailService, IUnitOfWork unitOfWork, IConfiguration configuration, IPatientRepository patientRepository, IStaffRepository staffRepository, ILogRepository logRepository, IUserMapper userMapper)
        {
            _userRepository = userRepository;
            _mailService = mailService;
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _patientRepository = patientRepository;
            _logRepository = logRepository;
            _userMapper = userMapper;
            _staffRepository = staffRepository;
        }

        public async Task<UserDTO> CreateUser(CreatingUserDTO dto)
        {
            try
            {
                var existingUserByEmail = await _userRepository.GetUserByEmailAsync(dto.Email);
                if (existingUserByEmail != null)
                {
                    throw new BusinessRuleValidationException("Email is already in use.");
                }

                var staff = await _staffRepository.GetByEmailAsync(dto.Email) ?? throw new BusinessRuleValidationException("Staff not found.");

                var existingUserByUsername = await _userRepository.GetUserByUsernameAsync(dto.Username);
                if (existingUserByUsername != null)
                {
                    throw new BusinessRuleValidationException("Username is already in use.");
                }

                staff.Activate();
                var user = _userMapper.ToDomain(dto);
                string token = CreateToken(user);
                await _mailService.SendEmail(dto.Email, "Activate your account", GenerateLink(token, "Activate"));
                await _userRepository.AddAsync(user);
                await _unitOfWork.CommitAsync();

                var userDto = _userMapper.ToDto(user);
                return userDto;
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


        public async Task<string> CreateUserAsPatient(CreatingPatientUserDTO dto)
        {
            var existingUserByEmail = await _userRepository.GetUserByEmailAsync(dto.Email);
            if (existingUserByEmail != null)
            {
                throw new Exception("Email is already in use.");
            }

            var patient = await _patientRepository.GetByEmailAsync(dto.Email);

            if (patient == null)
            {
                return null;
            }

            if (patient.PhoneNumber != dto.PhoneNumber)
            {
                throw new Exception("Phone number does not match the Patient's profile with the given email.");
            }

            var user = _userMapper.ToCreatingPatientUser(dto, patient.Id.AsGuid());
            string token = CreateToken(user);
            
            await _mailService.SendEmail(dto.Email, "Activate your account", GenerateLink(token, "ActivatePatientUser"));
            await _userRepository.AddAsync(user);
            await _unitOfWork.CommitAsync();

            return token;
        }

        // Activate a user and set the password
        public async Task<UserDTO> ActivateUser(string token, string newPassword)
        {
            try{
                var userId = VerifyToken(token);
                var user = await _userRepository.GetByIdAsync(userId) ?? throw new BusinessRuleValidationException("User not found.");
                user.SetPassword(newPassword);
                user.Activate();

                await _userRepository.UpdateAsync(user);
                await _unitOfWork.CommitAsync();

                var userDTO = _userMapper.ToDto(user);
                return userDTO;
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

        public async Task<UserDTO> ActivateUserAsPatient(string token)
        {
            var userId = VerifyToken(token);
            if (userId == null)
            {
                throw new Exception("Invalid or expired token.");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return null;
            }
            var patient = await _patientRepository.GetByEmailAsync(user.Email);
            if (patient == null)
            {
                return null;
            }
            user.Activate();

            await _userRepository.UpdateAsync(user);
            await _unitOfWork.CommitAsync();

            var userDto = _userMapper.ToDto(user);

            return userDto;
        }

        public string CheckGoogleToken(string email)
        {
            var user = _userRepository.GetUserByEmailAsync(email).Result;
            if (user == null)
            {
                return null;
            }
            return CreateToken(user);
        }

        public string CreateToken(User user)
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
            var encodedToken = HttpUtility.UrlEncode(token);
            string kebabCaseLink = ConvertToKebabCase(typeOfLink);
            var link = $"http://localhost:4200/{kebabCaseLink}?token={encodedToken}";
            Console.WriteLine("--------Link " + link);
            return link;
        }

        private static string ConvertToKebabCase(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            var sb = new StringBuilder();
            for (int i = 0; i < input.Length; i++)
            {
                if (char.IsUpper(input[i]))
                {
                    if (i > 0)
                        sb.Append('-');
                    sb.Append(char.ToLower(input[i]));
                }
                else
                {
                    sb.Append(input[i]);
                }
            }
            return sb.ToString();
        }

        public async Task<string> Login(LoginUserDTO dto)
        {
            var user = await _userRepository.GetUserByEmailAsync(dto.Email) ?? throw new Exception("Email not registered");

            if (!user.IsActive)
            {
                throw new Exception("User is not active. Check your Email to activate the account.");
            }

            if (user.IsAccountLocked())
            {
                throw new Exception($"Your account is locked until {user.LockedUntil.Value.ToLocalTime()}. Please try again later.");
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                user.RegisterFailedLoginAttempt();

                await _userRepository.UpdateAsync(user);
                await _unitOfWork.CommitAsync();

                if (user.IsAccountLocked())
                {
                    await NotifyAdmin(user);
                    throw new Exception("Your account has been locked due to multiple failed login attempts. Please try again in 30 minutes. An admin has been notified.");
                }

                throw new Exception($"Wrong password. You have {5 - user.FailedLoginAttempts} attempts left before your account is locked.");
            }

            // Reset failed attempts after successful login
            user.ResetFailedLoginAttempts();
            user.UnlockAccount();

            await _userRepository.UpdateAsync(user);
            await _unitOfWork.CommitAsync();

            string token = CreateToken(user);

            return token;
        }

        private async Task NotifyAdmin(User user)
        {
            try
            {
                var adminEmail = _configuration["AdminSettings:AdminEmail"];
                var subject = $"Account Locked: {user.Email}";
                var message = $"The user with email: {user.Email} has been locked after 5 failed login attempts.";
                await _mailService.SendEmailToAdminAsync(adminEmail, subject, message);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to notify admin: " + ex.Message);
            }
        }

        public async Task RequestDelete(string token)
        {
            try
            {
                var userId = VerifyToken(token) ?? throw new Exception("Invalid or expired token.");
                var user = await _userRepository.GetByIdAsync(userId);

                if (user == null)
                {
                    throw new Exception("User not found.");
                }
                var name = user.Username;
                await _mailService.SendDeletePatientUserEmailAsync(user.Email, name, GenerateLink(token, "DeleteUser"));
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteUser(string token)
        {
            try
            {
                var userId = VerifyToken(token) ?? throw new Exception("Invalid or expired token.");
                var user = await _userRepository.GetByIdAsync(userId);

                _userRepository.Remove(user);

                var log = new Log(TypeOfAction.Delete, userId.ToString(), "User of Type: " + user.Role.ToString() + "was deleted.");
                await _logRepository.AddAsync(log);

                await _unitOfWork.CommitAsync();
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task RequestPasswordReset(string email)
        {
            try
            {
                var user = await _userRepository.GetUserByEmailAsync(email) ?? throw new BusinessRuleValidationException("Email not registered");
                if (user.IsActive == false)
                {
                    throw new BusinessRuleValidationException("Account not ative yet, check your email to activate the account.");
                }
                string token = CreatePasswordResetToken(user);
                Console.WriteLine("---------------- Token: " + token);
                var resetLink = GenerateLink(token, "ResetPassword");

                var name = user.Username;

                await _mailService.SendResetPasswordEmailAsync(email, name, resetLink);
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

        public string CreatePasswordResetToken(User user)
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
                expires: DateTime.Now.AddHours(24),
                signingCredentials: cred
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
        public async Task ResetPassword(string token, ResetPasswordDTO dto)
        {
            try
            {
                // Verify the token validade
                var userID = VerifyToken(token);

                var user = await _userRepository.GetByIdAsync(userID) ?? throw new BusinessRuleValidationException("User not found.");
                if (dto.NewPassword != dto.NewPasswordConfirm)
                {
                    throw new BusinessRuleValidationException("Passwords do not match.");
                }

                user.SetPassword(dto.NewPassword);

                await _userRepository.UpdateAsync(user);
                await _unitOfWork.CommitAsync();
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

        public async Task<List<UserDTO>> getAllUsers()
        {
            var users = await _userRepository.GetAllAsync();
            var usersDTO = new List<UserDTO>();
            foreach (var user in users)
            {
                usersDTO.Add(_userMapper.ToDto(user));
            }
            return usersDTO;
        }

        //Update patient
        public async Task RequestUpdateUserPatient(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email) ?? throw new Exception("Email not registered");
            if (user.IsActive == false)
            {
                throw new Exception("Account not ative yet,  check your email to activate the account.");
            }
            string token = CreateToken(user);
            var updateLink = GenerateLink(token, "UpdatePatient");

            var name = user.Username;

            await _mailService.SendUpdateProfileAsync(email, name, updateLink);
        }

        //Update patient user profile when patient confirms the email
        public async Task UpdateUserPatient(string token, UpdatePatientUserDTO dto)
        {
            var userId = VerifyToken(token) ?? throw new Exception("Invalid or expired token.");
            var user = await _userRepository.GetByIdAsync(userId) ?? throw new Exception("User not found.");
            var patient = await _patientRepository.GetByEmailAsync(user.Email) ?? throw new Exception("Patient not found.");

            var updatedFields = new List<string>();


            var updateActions = new Dictionary<string, Action>
            {
                { "Email", () => {
                    if (!string.IsNullOrEmpty(dto.Email) && user.Email != dto.Email)
                    {
                        user.ChangeEmail(dto.Email);
                        patient.ChangeEmail(dto.Email);
                        updatedFields.Add("Email");
                    }
                }},
                { "Password", () => {
                    if (!string.IsNullOrEmpty(dto.Password) && user.PasswordHash != dto.Password)
                    {
                        user.SetPassword(dto.Password);
                        updatedFields.Add("Password");
                    }
                }},
                { "PhoneNumber", () => {
                    if (!string.IsNullOrEmpty(dto.PhoneNumber) && patient.PhoneNumber != dto.PhoneNumber)
                    {
                        user.ChangePhoneNumber(dto.PhoneNumber);
                        patient.ChangePhoneNumber(dto.PhoneNumber);
                        updatedFields.Add("PhoneNumber");
                    }
                }}
            };


            foreach (var action in updateActions.Values)
            {
                action();
            }


            await _userRepository.UpdateAsync(user);
            await _patientRepository.UpdateAsync(patient);
            await _unitOfWork.CommitAsync();
        }

        public async Task<GoogleJsonWebSignature.Payload> ValidateGoogleToken(string token)
        {
            var validationSettings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _configuration["GoogleSettings:GoogleClientId"] }
            };

            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(token, validationSettings);
                return payload;
            }
            catch (InvalidJwtException)
            {
                return null;
            }
        }
    }
}
