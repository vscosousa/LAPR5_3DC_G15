using Moq;
using Xunit;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Logs;
using System;
using System.Collections.Generic;

namespace DDDSample1.Tests.Patients.UnitTests
{
    public class PatientServiceTests
    {
        private readonly PatientService _service;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly Mock<IPatientMapper> _patientMapperMock;
        private readonly Mock<ILogRepository> _logRepositoryMock;
        public PatientServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _patientMapperMock = new Mock<IPatientMapper>();
            _logRepositoryMock = new Mock<ILogRepository>();

            _service = new PatientService(
                _unitOfWorkMock.Object,
                _patientRepositoryMock.Object,
                _patientMapperMock.Object,
                _logRepositoryMock.Object
            );
        }

        [Fact]
        public async Task CreatePatientSuccessfullyTest()
        {
            var dto = new CreatingPatientDTO
            {
                FirstName = "João",
                LastName = "Dotado",
                FullName = "João Dotado",
                DateOfBirth = "1990/01/01",
                GenderOptions = GenderOptions.Male,
                Email = "joao.dotado@example.com",
                PhoneNumber = "+351912345678",
                EmergencyContact = "+351987654321",
                MedicalConditions = "None"
            };

            var expectedPatient = new Patient(
                "João",
                "Dotado",
                "João Dotado",
                new DateOnly(1990, 1, 1),
                GenderOptions.Male,
                "joao.dotado@example.com",
                "+351912345678",
                "+351987654321",
                "None"
            );

            _patientMapperMock.Setup(m => m.ToDomain(dto)).Returns(expectedPatient);
            _patientRepositoryMock.Setup(r => r.GetByEmailAsync(expectedPatient.Email)).ReturnsAsync((Patient)null);
            _patientRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(expectedPatient.PhoneNumber)).ReturnsAsync((Patient)null);
            _patientRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Patient>());
            _patientRepositoryMock.Setup(r => r.AddAsync(expectedPatient)).ReturnsAsync(expectedPatient);


            var createdPatient = await _service.CreatePatient(dto);

            Assert.NotNull(createdPatient);
            Assert.Equal(expectedPatient.FirstName, createdPatient.FirstName);
            Assert.Equal(expectedPatient.LastName, createdPatient.LastName);
            Assert.Equal(expectedPatient.FullName, createdPatient.FullName);
            Assert.Equal(expectedPatient.DateOfBirth, createdPatient.DateOfBirth);
            Assert.Equal(expectedPatient.GenderOptions, createdPatient.GenderOptions);
            Assert.Equal(expectedPatient.Email, createdPatient.Email);
            Assert.Equal(expectedPatient.PhoneNumber, createdPatient.PhoneNumber);
            Assert.Equal(expectedPatient.EmergencyContact, createdPatient.EmergencyContact);
            Assert.Equal(expectedPatient.MedicalConditions, createdPatient.MedicalConditions);
        }

        [Fact]
        public async Task CreatePatientFailsDueToDuplicateEmailTest()
        {
            var dto = new CreatingPatientDTO
            {
                FirstName = "João",
                LastName = "Dotado",
                FullName = "João Dotado",
                DateOfBirth = "1990/01/01",
                GenderOptions = GenderOptions.Male,
                Email = "joao.dotado@example.com",
                PhoneNumber = "+351912345678",
                EmergencyContact = "+351987654321",
                MedicalConditions = "None"
            };

            var existingPatient = new Patient(
                "Existing",
                "Patient",
                "Existing Patient",
                new DateOnly(1985, 5, 15),
                GenderOptions.Male,
                "joao.dotado@example.com",
                "+351987654321",
                "+351912345678",
                "None"
            );

            _patientMapperMock.Setup(m => m.ToDomain(dto)).Returns(existingPatient);
            _patientRepositoryMock.Setup(r => r.GetByEmailAsync(existingPatient.Email)).ReturnsAsync(existingPatient);
            _patientRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(existingPatient.PhoneNumber)).ReturnsAsync((Patient)null);
            _patientRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Patient>());

            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.CreatePatient(dto));
        }

        [Fact]
        public async Task CreatePatientFailsDueToDuplicatePhoneNumberTest()
        {
            var dto = new CreatingPatientDTO
            {
                FirstName = "João",
                LastName = "Dotado",
                FullName = "João Dotado",
                DateOfBirth = "1990/01/01",
                GenderOptions = GenderOptions.Male,
                Email = "joao.dotado@gmail.com",
                PhoneNumber = "+351912345678",
                EmergencyContact = "+351987654321",
                MedicalConditions = "None"
            };

            var existingPatient = new Patient(
                "Existing",
                "Patient",
                "Existing Patient",
                new DateOnly(1985, 5, 15),
                GenderOptions.Male,
                "outro@gmail.com",
                "+351912345678",
                "+351987654321",
                "None"
            );

            _patientMapperMock.Setup(m => m.ToDomain(dto)).Returns(existingPatient);
            _patientRepositoryMock.Setup(r => r.GetByEmailAsync(existingPatient.Email)).ReturnsAsync((Patient)null);
            _patientRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(existingPatient.PhoneNumber)).ReturnsAsync(existingPatient);
            _patientRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Patient>());

            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.CreatePatient(dto));
        }
    }
}