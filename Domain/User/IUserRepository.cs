using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.User
{
    public interface IUserRepository : IRepository<User, UserID>
    {
        Task<User> GetUserByEmailAsync(string email);
    }

}