using System;
using System.Linq;
using Xunit;
using DDDSample1.Domain.Patients;
using Projetos.LAPR5_3DC_G15.Mappers.Patients;
using Projetos.LAPR5_3DC_G15.Domain.Shared;
using DDDSample1.Domain.Shared;

namespace Projetos.LAPR5_3DC_G15.Tests.Mappers.Patients
{
    public class PatientMapperTests
    {
        private readonly PatientMapper _mapper;

        public PatientMapperTests()
        {
            _mapper = new PatientMapper();
        }

        [Fact]
        public void MapToPatientDTOSuccessfully()
        {
            // Arrange
            var patient = new Patient(
                "John",
                "Doe",
                "John Doe",
                DateOnly.ParseExact("1990-01-01", "yyyy-MM-dd"),
                GenderOptions.Male,
                "john.doe@example.com",
                "+1234567890",
                "+0987654321",
                "None"
            );

            // Act
            var dto = _mapper.ToDto(patient);

            // Assert
            Assert.Equal(patient.Id.AsGuid(), dto.Id);
            Assert.Equal(patient.FirstName, dto.FirstName);
            Assert.Equal(patient.LastName, dto.LastName);
            Assert.Equal(patient.FullName, dto.FullName);
            Assert.Equal(patient.DateOfBirth.ToString(), dto.DateOfBirth);
            Assert.Equal(patient.GenderOptions, dto.Gender);
            Assert.Equal(patient.MedicalRecordNumber, dto.MedicalRecordNumber);
            Assert.Equal(patient.Email, dto.Email);
            Assert.Equal(patient.PhoneNumber, dto.PhoneNumber);
            Assert.Equal(patient.EmergencyContact, dto.EmergencyContact);
            Assert.Equal(patient.MedicalConditions, dto.MedicalConditions);
            Assert.Equal(patient.AppointmentHistory.Select(date => date.ToString()).ToArray(), dto.AppointmentHistory);
            Assert.Equal(patient.IsActive, dto.IsActive);
        }

        [Fact]
        public void MapToDomainSuccessfully()
        {
            // Arrange
            var dto = new CreatingPatientDTO
            {
                FirstName = "John",
                LastName = "Doe",
                FullName = "John Doe",
                DateOfBirth = "1990-01-01",
                GenderOptions = GenderOptions.Male,
                Email = "john.doe@example.com",
                PhoneNumber = "+1234567890",
                EmergencyContact = "+0987654321",
                MedicalConditions = "None"
            };

            // Act
            var patient = _mapper.ToDomain(dto);

            // Assert
            Assert.Equal(dto.FirstName, patient.FirstName);
            Assert.Equal(dto.LastName, patient.LastName);
            Assert.Equal(dto.FullName, patient.FullName);
            Assert.Equal(DateOnly.Parse(dto.DateOfBirth), patient.DateOfBirth);
            Assert.Equal(dto.GenderOptions, patient.GenderOptions);
            Assert.Equal(dto.Email, patient.Email);
            Assert.Equal(dto.PhoneNumber, patient.PhoneNumber);
            Assert.Equal(dto.EmergencyContact, patient.EmergencyContact);
            Assert.Equal(dto.MedicalConditions, patient.MedicalConditions);
        }

        [Fact]
        public void MapToCreatingPatientDTOSuccessfully()
        {
            // Arrange
            var patient = new Patient(
                "John",
                "Doe",
                "John Doe",
                DateOnly.ParseExact("1990-01-01", "yyyy-MM-dd"),
                GenderOptions.Male,
                "john.doe@example.com",
                "+1234567890",
                "+0987654321",
                "None"
            );

            // Act
            var dto = _mapper.ToCreatingDto(patient);

            // Assert
            Assert.Equal(patient.FirstName, dto.FirstName);
            Assert.Equal(patient.LastName, dto.LastName);
            Assert.Equal(patient.FullName, dto.FullName);
            Assert.Equal(patient.DateOfBirth.ToString(), dto.DateOfBirth);
            Assert.Equal(patient.GenderOptions, dto.GenderOptions);
            Assert.Equal(patient.Email, dto.Email);
            Assert.Equal(patient.PhoneNumber, dto.PhoneNumber);
            Assert.Equal(patient.EmergencyContact, dto.EmergencyContact);
            Assert.Equal(patient.MedicalConditions, dto.MedicalConditions);
        }
    }
}