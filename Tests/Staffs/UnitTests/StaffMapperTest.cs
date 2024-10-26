using System;
using System.Linq;
using Xunit;
using DDDSample1.Domain.Staffs;
using Projetos.LAPR5_3DC_G15.Mappers.Staffs;
using Projetos.LAPR5_3DC_G15.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace Projetos.LAPR5_3DC_G15.Tests.Mappers.Staffs
{
    public class StaffMapperTests
    {
        private readonly StaffMapper _mapper;

        public StaffMapperTests()
        {
            _mapper = new StaffMapper();
        }

        [Fact]
        public void MapToStaffDTOSuccessfully()
        {
            // Arrange
            var staff = new Staff(
                "Test",
                "Afonso",
                "Test Afonso",
                "teste@example.com",
                "+351923456789",
                new SpecializationId(Guid.NewGuid())
            );

            // Act
            var dto = _mapper.ToDto(staff);

            // Assert
            Assert.Equal(staff.Id.AsGuid(), dto.Id);
            Assert.Equal(staff.FirstName, dto.FirstName);
            Assert.Equal(staff.LastName, dto.LastName);
            Assert.Equal(staff.FullName, dto.FullName);
            Assert.Equal(staff.LicenseNumber.ToString(), dto.LicenseNumber);
            Assert.Equal(staff.Email, dto.Email);
            Assert.Equal(staff.PhoneNumber, dto.PhoneNumber);
            Assert.Equal(staff.AvailabilitySlots.Select(date => date.ToString()).ToArray(), dto.AvailabilitySlots);
            Assert.Equal(staff.SpecializationId.AsGuid(), dto.SpecializationId);
            Assert.Equal(staff.IsActive, dto.IsActive);
        }

        [Fact]
        public void MapToDomainSuccessfully()
        {
            // Arrange
            var dto = new CreatingStaffDTO
            {
                FirstName = "Test",
                LastName = "Afonso",
                FullName = "Test Afonso",
                Email = "teste@example.com",
                PhoneNumber = "+351923456789"
            };

            // Act
            var staff = _mapper.ToDomain(dto);

            // Assert
            Assert.Equal(dto.FirstName, staff.FirstName);
            Assert.Equal(dto.LastName, staff.LastName);
            Assert.Equal(dto.FullName, staff.FullName);
            Assert.Equal(dto.Email, staff.Email);
            Assert.Equal(dto.PhoneNumber, staff.PhoneNumber);
            Assert.Equal(new SpecializationId(dto.SpecializationId), staff.SpecializationId);
        }

        [Fact]
        public void MapToCreatingStaffDTOSuccessfully()
        {
            // Arrange
            var specialization = new Specialization("Specialization");
            var staff = new Staff(
                "Test",
                "Afonso",
                "Test Afonso",
                "test@example.com",
                "+351923456789",
                specialization.Id
            );

            // Act
            var dto = _mapper.ToCreatingDto(staff);

            // Assert
            Assert.Equal(staff.FirstName, dto.FirstName);
            Assert.Equal(staff.LastName, dto.LastName);
            Assert.Equal(staff.FullName, dto.FullName);
            Assert.Equal(staff.Email, dto.Email);
            Assert.Equal(staff.PhoneNumber, dto.PhoneNumber);
        }
    }
}
