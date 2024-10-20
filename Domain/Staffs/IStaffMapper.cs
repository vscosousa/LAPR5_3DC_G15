using System;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Shared;

using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace DDDSample1.Domain.Staffs
{
    public interface IStaffMapper : IMapper<Staff, StaffDTO, CreatingStaffDTO>
    {
    }
}