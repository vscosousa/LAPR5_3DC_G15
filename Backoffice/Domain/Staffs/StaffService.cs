using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Logs;
using System.Linq;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Web;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _repository;
        private readonly IStaffMapper _mapper;
        private readonly ISpecializationRepository _specializationRepository;
        private readonly ILogRepository _logRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMailService _mailService;
        private readonly IConfiguration _configuration;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repository, IStaffMapper mapper, ISpecializationRepository specializationRepository, IUserRepository userRepository, ILogRepository logRepository, IMailService mailService, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _mapper = mapper;
            _specializationRepository = specializationRepository;
            _userRepository = userRepository;
            _logRepository = logRepository;
            _mailService = mailService;
            _configuration = configuration;
        }
        // Create a new Staff
        public async Task<StaffDTO> CreateStaffAsync(CreatingStaffDTO dto)
        {
            try
            {   
                if (!string.IsNullOrEmpty(dto.SpecializationName)){
                    var specialization = _specializationRepository.GetSpecIdByOptionAsync(dto.SpecializationName).Result;
                    if (specialization == null)
                    {
                        throw new BusinessRuleValidationException($"Specialization with name {dto.SpecializationName} not found.");
                    }
                    dto.SetSpecializationId(specialization.Id.AsGuid());
                }

                if (!Enum.TryParse(typeof(StaffType), dto.StaffType, out var staffType))
                {
                    throw new BusinessRuleValidationException($"Invalid staff type: {dto.StaffType}");
                }
                
                var staff = _mapper.ToDomain(dto);

                // Verificar unicidade do email e telefone
                if (await _repository.GetByEmailAsync(staff.Email) != null)
                    throw new BusinessRuleValidationException("Email is already in use.");

                if (await _repository.GetByPhoneNumberAsync(staff.PhoneNumber) != null)
                    throw new BusinessRuleValidationException("Phone number is already in use.");
                
                var list = await _repository.GetAllAsync();
                staff.SetLicenseNumber(LicenseNumberGenerator.GenerateLicenseNumber(list.Count));
                
                await _repository.AddAsync(staff);
                await _unitOfWork.CommitAsync();
                Console.WriteLine("Transaction committed successfully");

                var staffDTO = _mapper.ToDto(staff);
                return staffDTO;
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
        
        //Update Staff - Phone Number, Email, Specialization, Availability Slots
        public async Task<StaffDTO> UpdateStaffAsync(Guid id, UpdateStaffDTO dto)
        {
            try{
                var staff = await _repository.GetByIdAsync(new StaffId(id));

                if (staff == null)
                    return null;

                Console.WriteLine("Updating staff PhoneNumber... " + dto.PhoneNumber);
                Console.WriteLine("Updating staff Email... " + dto.Email);
                Console.WriteLine("Updating staff AddAvailabilitySlots... " + dto.AddAvailabilitySlots);
                Console.WriteLine("Updating staff RemoveAvailabilitySlots... " + dto.RemoveAvailabilitySlots);
                Console.WriteLine("Updating staff SpecializationName... " + dto.SpecializationName);

                var updatedFields = new List<string>();
                var newUpdatedContacts = new UpdateStaffDTO();
                var sendEmail = false;
               
                // Update Phone Number
                if (!string.IsNullOrEmpty(dto.PhoneNumber) && staff.PhoneNumber != dto.PhoneNumber)
                {   
                    if (!dto.PhoneNumber.StartsWith("+") || !dto.PhoneNumber.Substring(1).All(char.IsDigit))
                        throw new BusinessRuleValidationException("Phone number must start with an identifier and contain only digits.");

                    if (await _repository.GetByPhoneNumberAsync(dto.PhoneNumber) != null)
                        throw new BusinessRuleValidationException("Phone number is already in use.");
                        
                    sendEmail = true;
                    newUpdatedContacts.SetPhoneNumber(dto.PhoneNumber);
                    updatedFields.Add("Sent confirmation email to Staff to update phone number");
                }
                
                // Update Email
                if (!string.IsNullOrEmpty(dto.Email) && staff.Email != dto.Email)
                {
                    if (await _repository.GetByEmailAsync(dto.Email) != null)
                        throw new BusinessRuleValidationException("Email is already in use.");

                    sendEmail = true;
                    newUpdatedContacts.SetEmail(dto.Email);
                    updatedFields.Add("Sent confirmation email to Staff to update email");
                }
                
                // Send Email
                if(sendEmail){
                    var token = CreateTokenStaff(staff);
                    var link = GenerateLinkToStaff(token, newUpdatedContacts);
                    await _mailService.SendEmailToStaff(staff.Email, staff.FullName, newUpdatedContacts, link);
                }
                
                // Add Availability Slots
                if (!string.IsNullOrEmpty(dto.AddAvailabilitySlots))
                {
                    var addSlots = dto.AddAvailabilitySlots.Split(',')
                                    .Select(slot => DateTime.Parse(slot.Trim()))
                                    .ToArray();
                    foreach (var slot in addSlots)
                    {
                        staff.AddAvailabilitySlot(slot);
                    }
                    updatedFields.Add("Added Availability Slots");
                }
                
                // Remove Availability Slots
                if (!string.IsNullOrEmpty(dto.RemoveAvailabilitySlots))
                {
                    var removeSlots = dto.RemoveAvailabilitySlots.Split(',')
                                        .Select(slot => DateTime.Parse(slot.Trim()))
                                        .ToArray();
                    foreach (var slot in removeSlots)
                    {
                        staff.RemoveAvailabilitySlot(slot);
                    }
                    updatedFields.Add("Removed Availability Slots");
                }
                
                // Update Specialization
                if (!string.IsNullOrEmpty(dto.SpecializationName))
                {   
                    var specialization = _specializationRepository.GetSpecIdByOptionAsync(dto.SpecializationName).Result;
                    if (specialization == null)
                    {
                        throw new BusinessRuleValidationException($"Specialization with name {dto.SpecializationName} not found.");
                    }
                    if (staff.SpecializationId.ToString() != dto.SpecializationId.ToString()){
                        dto.SetSpecializationId(specialization.Id.AsGuid());
                        staff.ChangeSpecializationId(specialization.Id);
                        updatedFields.Add("Specialization");
                    }
                }
                
                if (updatedFields.Count > 0)
                {
                    var logMessage = $"Staff updated. The following fields were updated: "+ string.Join(", ", updatedFields) +".";
                    var log = new Log(TypeOfAction.Update, id.ToString(), logMessage);
                    await _logRepository.AddAsync(log);

                    await _unitOfWork.CommitAsync();
                }

                return _mapper.ToDto(staff);
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

        public async Task<StaffDTO> UpdateContactInformationAsync(string token, string phoneNumber , string email)
        {
            try
            {
                var staffId = VerifyTokenStaff(token);
                var staff = await _repository.GetByIdAsync(staffId);

                if (staff == null)
                    throw new BusinessRuleValidationException("Staff not found.");

                var user = await _userRepository.GetUserByEmailAsync(staff.Email);
                
                var updatedFields = new List<string>();

                if (!string.IsNullOrEmpty(phoneNumber) && staff.PhoneNumber != phoneNumber) {
                    staff.ChangePhoneNumber(phoneNumber);
                    if (user != null) 
                        user.ChangePhoneNumber(phoneNumber);   
                    updatedFields.Add("Phone Number Updated");
                }
                
                if (!string.IsNullOrEmpty(email) && staff.Email != email) {
                    staff.ChangeEmail(email);
                    if (user != null)
                        user.ChangeEmail(email);     
                    updatedFields.Add("Email Updated");
                }

                if (updatedFields.Count > 0){
                    var logMessage = "Staff confirmed update:"+ string.Join(", ", updatedFields) +".";
                    var log = new Log(TypeOfAction.Update, staffId.ToString(), logMessage);
                    await _logRepository.AddAsync(log);

                    await _unitOfWork.CommitAsync();
                }

                return _mapper.ToDto(staff);
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

        public string CreateTokenStaff(Staff staff)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, staff.Id.AsGuid().ToString()),
                new Claim(ClaimTypes.Email, staff.Email),
                new Claim("PhoneNumber", staff.PhoneNumber)
            };

            var key = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException(nameof(key), "JWT key cannot be null or empty.");
            }
        
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var cred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: cred
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private static string GenerateLinkToStaff(string token, UpdateStaffDTO dto)
        {
            var encodedPhoneNumber = HttpUtility.UrlEncode(dto.PhoneNumber);
            var encodedEmail = HttpUtility.UrlEncode(dto.Email);
            var encodedToken = HttpUtility.UrlEncode(token);

            var link = $"http://localhost:4200/LAPR5_3DC_G15/update-staff/ConfirmUpdates?phoneNumber={encodedPhoneNumber}&email={encodedEmail}&token={encodedToken}";
            Console.WriteLine("Link to Confirm Update Contact: " + link);
            return link;
        }

        private StaffId VerifyTokenStaff(string token)
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

                var staffIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier) ?? throw new Exception("Staff ID not found in token.");
                if (!Guid.TryParse(staffIdClaim.Value, out Guid staffId))
                {
                    throw new Exception("Invalid user ID in token.");
                }

                return new StaffId(staffId);
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

        //Deactivate Staff - Staff is no longer available to work
        public async Task<StaffDTO> DeactivateStaffAsync(Guid id)
        {
            try
            {
                var staff = await _repository.GetByIdAsync(new StaffId(id));

                if (staff == null)
                    return null;

                staff.Deactivate();
                
                var user = await _userRepository.GetUserByEmailAsync(staff.Email);
                
                if (user != null)
                {
                    _userRepository.Remove(user);
                }

                var logMessage = $"Staff profile {staff.FullName} (ID: {staff.Id}) has been deactivated.";
                var log = new Log(TypeOfAction.Deactivate, id.ToString(), logMessage);
                await _logRepository.AddAsync(log);

                await _unitOfWork.CommitAsync();
                return _mapper.ToDto(staff);    
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

        //Search Staff Profiles - First Name, Last Name, Full Name, Email, SpecializationName
        public async Task<List<StaffDTO>> SearchStaffProfiles(SearchStaffDTO dto)
        {   
            try
            {   
                if (!string.IsNullOrEmpty(dto.SpecializationName)){
                    var specialization = _specializationRepository.GetSpecIdByOptionAsync(dto.SpecializationName).Result;
                    if (specialization == null)
                    {
                        throw new BusinessRuleValidationException($"Specialization with name {dto.SpecializationName} not found.");
                    }
                    dto.SetSpecializationId(specialization.Id.AsGuid());
                }

                var staffProfiles = await _repository.SearchStaffAsync(dto);

                if (staffProfiles == null || staffProfiles.Count == 0)
                {
                    return null;
                }

                return staffProfiles.ConvertAll(_mapper.ToDto);
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

        public IEnumerable<string> GetStaffTypes()
        {
            return Enum.GetNames(typeof(StaffType));
        }

        public async Task<StaffDTO> GetStaffByIdAsync(Guid id)
        {
            try{
                var staff = await _repository.GetByIdAsync(new StaffId(id));
                if (staff == null)
                {
                    throw new KeyNotFoundException("Staff not found.");
                }
                return _mapper.ToDto(staff);
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

        public async Task<List<StaffDTO>> GetAllStaffsAsync()
        {
            try
            {
                var staffs = await _repository.GetAllAsync();
                return staffs.ConvertAll(_mapper.ToDto);
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



    }
}