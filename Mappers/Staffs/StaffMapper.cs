using System;
using System.Linq;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.Specializations;
using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace Projetos.LAPR5_3DC_G15.Mappers.Staffs
{
    public class StaffMapper : IMapper<Staff, StaffDTO, CreatingStaffDTO>, IStaffMapper
    {
        public StaffDTO ToDto(Staff domain)
        {   
            
            return new StaffDTO
            {
                Id = domain.Id.AsGuid(),
                FirstName = domain.FirstName,
                LastName = domain.LastName,
                FullName = domain.FullName,
                LicenseNumber = domain.LicenseNumber.ToString(),
                Email = domain.Email,
                PhoneNumber = domain.PhoneNumber,
                AvailabilitySlots = domain.AvailabilitySlots.Select(date => date.ToString()).ToArray(),
                SpecializationId = domain.SpecializationId.AsGuid(),
                IsActive = domain.IsActive
            };
        }

        public Staff ToDomain(CreatingStaffDTO dto)
        {
            return new Staff(
                dto.FirstName,
                dto.LastName,
                dto.FullName,
                dto.Email,
                dto.PhoneNumber,
                new SpecializationId(dto.SpecializationId)
            );
        }

        public CreatingStaffDTO ToCreatingDto(Staff domain)
        {
            return new CreatingStaffDTO
            {
                FirstName = domain.FirstName,
                LastName = domain.LastName,
                FullName = domain.FullName,
                Email = domain.Email,
                PhoneNumber = domain.PhoneNumber,
                SpecializationId = domain.SpecializationId.AsGuid()
            };
        }
    }
}