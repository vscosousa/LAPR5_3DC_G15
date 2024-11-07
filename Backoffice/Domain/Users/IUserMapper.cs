using System;
using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public interface IUserMapper : IMapper<User, UserDTO, CreatingUserDTO>
    {
        User ToCreatingPatientUser(CreatingPatientUserDTO domain, Guid patientId);
    }
}