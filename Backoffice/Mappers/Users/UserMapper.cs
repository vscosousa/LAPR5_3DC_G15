using DDDSample1.Domain.Users;
using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace Projetos.LAPR5_3DC_G15.Mappers.Users
{
    public class UserMapper : IMapper<User, UserDTO, CreatingUserDTO>, IUserMapper
    {
        public UserDTO ToDto(User domain)
        {
            return new UserDTO
            {
                Id = domain.Id.AsGuid(),
                Email = domain.Email,
                Username = domain.Username,
                IsActive = domain.IsActive
            };
        }

        public User ToDomain(CreatingUserDTO dto)
        {
            return new User(
                dto.Email,
                dto.Username,
                dto.Role,
                dto.StaffId
            );
        }

        public CreatingUserDTO ToCreatingDto(User domain)
        {
            return new CreatingUserDTO
            {
                Email = domain.Email,
                Username = domain.Username,
                Role = domain.Role
            };
        }

        public User ToCreatingPatientUser(CreatingPatientUserDTO dto)
        {
            return new User
            (
              dto.Email,
              dto.Password,
              dto.PhoneNumber,
              dto.PatientId
            );   
        }
    }
}