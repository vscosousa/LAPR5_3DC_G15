using DDDSample1.Domain.Patients;
using DDDSample1.Domain.User;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Users
{
    public class UserRepository : BaseRepository<User, UserID>,IUserRepository
    {
        public UserRepository(DDDSample1DbContext context):base(context.Users)
        {
           
        }
    }
}