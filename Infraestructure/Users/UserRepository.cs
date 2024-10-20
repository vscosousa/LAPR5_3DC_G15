using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Users
{
    public class UserRepository : BaseRepository<User, UserID>, IUserRepository
    {
        public UserRepository(DDDSample1DbContext context):base(context.Users)
        {
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _objs.Where(x => email.Equals(x.Email)).FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByPhoneNumberAsync(string phoneNumber)
        {
            return await _objs.Where(x => phoneNumber.Equals(x.PhoneNumber)).FirstOrDefaultAsync();
        }

        public Task<User> GetUserByUsernameAsync(string username)
        {
            return _objs.Where(x => username.Equals(x.Username)).FirstOrDefaultAsync();
        }
    }
}