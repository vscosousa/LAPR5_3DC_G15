using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Logs;
using System;
using System.Collections.Generic;
using System.Linq;
using Moq;
using Xunit;

namespace DDDSample1.Tests.Patients.UnitTests
{
    [Collection("Patient Collection")]
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

        private CreatingPatientDTO CreateSamplePatientDTO() => new CreatingPatientDTO
        {
            FirstName = "João",
            LastName = "Silva",
            FullName = "João Silva",
            DateOfBirth = "1990/01/01",
            GenderOptions = GenderOptions.Male,
            Email = "joao.silva@example.com",
            PhoneNumber = "+351912345678",
            EmergencyContact = "+351987654321",
            MedicalConditions = "Nenhuma"
        };

        private Patient CreateSamplePatient() => new Patient(
            "João",
            "Silva",
            "João Silva",
            new DateOnly(1990, 1, 1),
            GenderOptions.Male,
            "joao.silva@example.com",
            "+351912345678",
            "+351987654321",
            "Nenhuma"
        );

        private List<Patient> CreateSamplePatients() => new List<Patient>
        {
            new Patient(
                "Maria",
                "Silva",
                "Maria Silva",
                new DateOnly(1985, 5, 15),
                GenderOptions.Female,
                "maria.silva@example.com",
                "+351912345678",
                "+351987654321",
                "Hipertensão"
            ),
            new Patient(
                "João",
                "Pereira",
                "João Pereira",
                new DateOnly(1978, 3, 22),
                GenderOptions.Male,
                "joao.pereira@example.com",
                "+351912345679",
                "+351987654322",
                "Diabetes"
            ),
            new Patient(
                "Ana",
                "Costa",
                "Ana Costa",
                new DateOnly(1992, 7, 30),
                GenderOptions.Female,
                "ana.costa@example.com",
                "+351912345680",
                "+351987654323",
                "Asma"
            ),
            new Patient(
                "Pedro",
                "Ferreira",
                "Pedro Ferreira",
                new DateOnly(1980, 11, 10),
                GenderOptions.Male,
                "pedro.ferreira@example.com",
                "+351912345681",
                "+351987654324",
                "Nenhuma"
            ),
            new Patient(
                "Sofia",
                "Rodrigues",
                "Sofia Rodrigues",
                new DateOnly(1995, 9, 25),
                GenderOptions.Female,
                "sofia.rodrigues@example.com",
                "+351912345682",
                "+351987654325",
                "Alergias"
            ),
            new Patient(
                "Sofia",
                "Sousa",
                "Sofia Sousa",
                new DateOnly(2000, 3, 24),
                GenderOptions.Female,
                "sofia.sousa@example.com",
                "+351912345681",
                "+351987654327",
                "Alergias"
            )
        };

        [Fact]
        public async Task CreatePatientSuccessfullyTest()
        {
            // Arrange
            var dto = CreateSamplePatientDTO();
            var expectedPatient = CreateSamplePatient();

            _patientMapperMock.Setup(m => m.ToDomain(dto)).Returns(expectedPatient);
            _patientRepositoryMock.Setup(r => r.GetByEmailAsync(expectedPatient.Email)).ReturnsAsync((Patient)null);
            _patientRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(expectedPatient.PhoneNumber)).ReturnsAsync((Patient)null);
            _patientRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Patient>());
            _patientRepositoryMock.Setup(r => r.AddAsync(expectedPatient)).ReturnsAsync(expectedPatient);
            _patientMapperMock.Setup(m => m.ToDto(expectedPatient)).Returns(new PatientDTO
            {
                Id = expectedPatient.Id.AsGuid(),
                FirstName = expectedPatient.FirstName,
                LastName = expectedPatient.LastName,
                FullName = expectedPatient.FullName,
                DateOfBirth = expectedPatient.DateOfBirth.ToString(),
                Gender = expectedPatient.GenderOptions,
                MedicalRecordNumber = expectedPatient.MedicalRecordNumber,
                Email = expectedPatient.Email,
                PhoneNumber = expectedPatient.PhoneNumber,
                EmergencyContact = expectedPatient.EmergencyContact,
                MedicalConditions = expectedPatient.MedicalConditions,
                AppointmentHistory = expectedPatient.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                IsActive = expectedPatient.IsActive
            });

            // Act
            var createdPatient = await _service.CreatePatient(dto);

            // Assert
            Assert.NotNull(createdPatient);
            Assert.Equal(expectedPatient.FirstName, createdPatient.FirstName);
            Assert.Equal(expectedPatient.LastName, createdPatient.LastName);
            Assert.Equal(expectedPatient.FullName, createdPatient.FullName);
            Assert.Equal(expectedPatient.DateOfBirth.ToString(), createdPatient.DateOfBirth.ToString());
            Assert.Equal(expectedPatient.GenderOptions, createdPatient.Gender);
            Assert.Equal(expectedPatient.Email, createdPatient.Email);
            Assert.Equal(expectedPatient.PhoneNumber, createdPatient.PhoneNumber);
            Assert.Equal(expectedPatient.EmergencyContact, createdPatient.EmergencyContact);
            Assert.Equal(expectedPatient.MedicalConditions, createdPatient.MedicalConditions);
            _patientMapperMock.Verify(m => m.ToDomain(dto), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetByEmailAsync(expectedPatient.Email), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(expectedPatient.PhoneNumber), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetAllAsync(), Times.Once);
            _patientRepositoryMock.Verify(r => r.AddAsync(expectedPatient), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            _patientMapperMock.Verify(m => m.ToDto(expectedPatient), Times.Once);
        }

        [Fact]
        public async Task CreatePatientFailsDueToDuplicateEmailTest()
        {
            // Arrange
            var dto = CreateSamplePatientDTO();
            var existingPatient = CreateSamplePatient();

            _patientMapperMock.Setup(m => m.ToDomain(dto)).Returns(existingPatient);
            _patientRepositoryMock.Setup(r => r.GetByEmailAsync(existingPatient.Email)).ReturnsAsync(existingPatient);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.CreatePatient(dto));
            _patientMapperMock.Verify(m => m.ToDomain(dto), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetByEmailAsync(existingPatient.Email), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(existingPatient.PhoneNumber), Times.Never);
            _patientRepositoryMock.Verify(r => r.GetAllAsync(), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task CreatePatientFailsDueToDuplicatePhoneNumberTest()
        {
            // Arrange
            var dto = CreateSamplePatientDTO();
            var existingPatient = CreateSamplePatient();

            _patientMapperMock.Setup(m => m.ToDomain(dto)).Returns(existingPatient);
            _patientRepositoryMock.Setup(r => r.GetByEmailAsync(existingPatient.Email)).ReturnsAsync((Patient)null);
            _patientRepositoryMock.Setup(r => r.GetByPhoneNumberAsync(existingPatient.PhoneNumber)).ReturnsAsync(existingPatient);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.CreatePatient(dto));
            _patientMapperMock.Verify(m => m.ToDomain(dto), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetByEmailAsync(existingPatient.Email), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetByPhoneNumberAsync(existingPatient.PhoneNumber), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetAllAsync(), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task UpdatePatientNamesSuccessfullyTest()
        {
            // Arrange
            var existingPatient = CreateSamplePatient();
            var dto = new UpdatePatientDTO
            {
                FirstName = "Paulo",
                LastName = "Gomes",
                FullName = "Paulo Gomes",
                Email = "",
                PhoneNumber = "",
                EmergencyContact = "",
                MedicalConditions = ""
            };

            var expectedUpdatedPatient = new Patient(
                "Paulo",
                "Gomes",
                "Paulo Gomes",
                existingPatient.DateOfBirth,
                existingPatient.GenderOptions,
                existingPatient.Email,
                existingPatient.PhoneNumber,
                existingPatient.EmergencyContact,
                existingPatient.MedicalConditions
            );

            string message = "Patient updated. The following fields were updated: First Name, Last Name, Full Name.";
            var log = new Log(TypeOfAction.Update, existingPatient.Id.ToString(), message);

            _patientRepositoryMock.Setup(r => r.GetByIdAsync(existingPatient.Id)).ReturnsAsync(existingPatient);
            _logRepositoryMock.Setup(r => r.AddAsync(It.IsAny<Log>())).ReturnsAsync(log);
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns(new PatientDTO
            {
                Id = existingPatient.Id.AsGuid(),
                FirstName = expectedUpdatedPatient.FirstName,
                LastName = expectedUpdatedPatient.LastName,
                FullName = expectedUpdatedPatient.FullName,
                DateOfBirth = expectedUpdatedPatient.DateOfBirth.ToString(),
                Gender = expectedUpdatedPatient.GenderOptions,
                MedicalRecordNumber = expectedUpdatedPatient.MedicalRecordNumber,
                Email = expectedUpdatedPatient.Email,
                PhoneNumber = expectedUpdatedPatient.PhoneNumber,
                EmergencyContact = expectedUpdatedPatient.EmergencyContact,
                MedicalConditions = expectedUpdatedPatient.MedicalConditions,
                AppointmentHistory = expectedUpdatedPatient.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                IsActive = expectedUpdatedPatient.IsActive
            });

            // Act
            var updatedPatientDTO = await _service.UpdatePatient(existingPatient.Id.AsGuid(), dto);

            // Assert
            Assert.NotNull(updatedPatientDTO);
            Assert.Equal(expectedUpdatedPatient.FirstName, updatedPatientDTO.FirstName);
            Assert.Equal(expectedUpdatedPatient.LastName, updatedPatientDTO.LastName);
            Assert.Equal(expectedUpdatedPatient.FullName, updatedPatientDTO.FullName);
            _patientMapperMock.Verify(m => m.ToDto(It.IsAny<Patient>()), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetByIdAsync(existingPatient.Id), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Once);
        }

        [Fact]
        public async Task UpdatePatientContactInformationSuccessfullyTest()
        {
            // Arrange
            var existingPatient = CreateSamplePatient();
            var dto = new UpdatePatientDTO
            {
                FirstName = "",
                LastName = "",
                FullName = "",
                Email = "novoemail@example.com",
                PhoneNumber = "+351912345679",
                EmergencyContact = "+351987654322",
                MedicalConditions = ""
            };

            var expectedUpdatedPatient = new Patient(
                existingPatient.FirstName,
                existingPatient.LastName,
                existingPatient.FullName,
                existingPatient.DateOfBirth,
                existingPatient.GenderOptions,
                dto.Email,
                dto.PhoneNumber,
                dto.EmergencyContact,
                existingPatient.MedicalConditions
            );

            string message = "Patient updated. The following fields were updated: Email, Phone Number, Emergency Contact.";
            var expectedLog = new Log(TypeOfAction.Update, existingPatient.Id.ToString(), message);

            _patientRepositoryMock.Setup(r => r.GetByIdAsync(existingPatient.Id)).ReturnsAsync(existingPatient);
            _logRepositoryMock.Setup(r => r.AddAsync(It.IsAny<Log>())).ReturnsAsync(expectedLog);
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns(new PatientDTO
            {
                Id = existingPatient.Id.AsGuid(),
                FirstName = expectedUpdatedPatient.FirstName,
                LastName = expectedUpdatedPatient.LastName,
                FullName = expectedUpdatedPatient.FullName,
                DateOfBirth = expectedUpdatedPatient.DateOfBirth.ToString(),
                Gender = expectedUpdatedPatient.GenderOptions,
                MedicalRecordNumber = expectedUpdatedPatient.MedicalRecordNumber,
                Email = expectedUpdatedPatient.Email,
                PhoneNumber = expectedUpdatedPatient.PhoneNumber,
                EmergencyContact = expectedUpdatedPatient.EmergencyContact,
                MedicalConditions = expectedUpdatedPatient.MedicalConditions,
                AppointmentHistory = expectedUpdatedPatient.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                IsActive = expectedUpdatedPatient.IsActive
            });

            // Act
            var updatedPatientDTO = await _service.UpdatePatient(existingPatient.Id.AsGuid(), dto);

            // Assert
            Assert.NotNull(updatedPatientDTO);
            Assert.Equal(expectedUpdatedPatient.Email, updatedPatientDTO.Email);
            Assert.Equal(expectedUpdatedPatient.PhoneNumber, updatedPatientDTO.PhoneNumber);
            Assert.Equal(expectedUpdatedPatient.EmergencyContact, updatedPatientDTO.EmergencyContact);
            _patientMapperMock.Verify(m => m.ToDto(It.IsAny<Patient>()), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetByIdAsync(existingPatient.Id), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Once);
        }

        [Fact]
        public async Task UpdatePatientMedicalConditionsSuccessfullyTest()
        {
            // Arrange
            var existingPatient = CreateSamplePatient();
            var dto = new UpdatePatientDTO
            {
                FirstName = "",
                LastName = "",
                FullName = "",
                Email = "",
                PhoneNumber = "",
                EmergencyContact = "",
                MedicalConditions = "Diabetes"
            };

            var expectedUpdatedPatient = new Patient(
                existingPatient.FirstName,
                existingPatient.LastName,
                existingPatient.FullName,
                existingPatient.DateOfBirth,
                existingPatient.GenderOptions,
                existingPatient.Email,
                existingPatient.PhoneNumber,
                existingPatient.EmergencyContact,
                dto.MedicalConditions
            );

            string message = "Patient updated. The following fields were updated: Medical Conditions.";
            var log = new Log(TypeOfAction.Update, existingPatient.Id.ToString(), message);

            _patientRepositoryMock.Setup(r => r.GetByIdAsync(existingPatient.Id)).ReturnsAsync(existingPatient);
            _logRepositoryMock.Setup(r => r.AddAsync(It.IsAny<Log>())).ReturnsAsync(log);
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns(new PatientDTO
            {
                Id = existingPatient.Id.AsGuid(),
                FirstName = expectedUpdatedPatient.FirstName,
                LastName = expectedUpdatedPatient.LastName,
                FullName = expectedUpdatedPatient.FullName,
                DateOfBirth = expectedUpdatedPatient.DateOfBirth.ToString(),
                Gender = expectedUpdatedPatient.GenderOptions,
                MedicalRecordNumber = expectedUpdatedPatient.MedicalRecordNumber,
                Email = expectedUpdatedPatient.Email,
                PhoneNumber = expectedUpdatedPatient.PhoneNumber,
                EmergencyContact = expectedUpdatedPatient.EmergencyContact,
                MedicalConditions = expectedUpdatedPatient.MedicalConditions,
                AppointmentHistory = expectedUpdatedPatient.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                IsActive = expectedUpdatedPatient.IsActive
            });

            // Act
            var updatedPatientDTO = await _service.UpdatePatient(existingPatient.Id.AsGuid(), dto);

            // Assert
            Assert.NotNull(updatedPatientDTO);
            Assert.Equal(expectedUpdatedPatient.MedicalConditions, updatedPatientDTO.MedicalConditions);
            _patientMapperMock.Verify(m => m.ToDto(It.IsAny<Patient>()), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetByIdAsync(existingPatient.Id), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Once);
        }


        [Fact]
        public async Task UpdatePatientEverythingSuccessfullyTest()
        {
            // Arrange
            var existingPatient = CreateSamplePatient();
            var dto = new UpdatePatientDTO
            {
                FirstName = "UpdatedFirstName",
                LastName = "UpdatedLastName",
                FullName = "UpdatedFullName",
                Email = "updated.email@example.com",
                PhoneNumber = "+351912345679",
                EmergencyContact = "+351987654322",
                MedicalConditions = "Diabetes"
            };
        
            var expectedUpdatedPatient = new Patient(
                dto.FirstName,
                dto.LastName,
                dto.FullName,
                existingPatient.DateOfBirth,
                existingPatient.GenderOptions,
                dto.Email,
                dto.PhoneNumber,
                dto.EmergencyContact,
                dto.MedicalConditions
            );
        
            string message = "Patient updated. The following fields were updated: Medical Conditions.";
            var log = new Log(TypeOfAction.Update, existingPatient.Id.ToString(), message);
        
            _patientRepositoryMock.Setup(r => r.GetByIdAsync(existingPatient.Id)).ReturnsAsync(existingPatient);
            _logRepositoryMock.Setup(r => r.AddAsync(It.IsAny<Log>())).ReturnsAsync(log);
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns(new PatientDTO
            {
                Id = existingPatient.Id.AsGuid(),
                FirstName = expectedUpdatedPatient.FirstName,
                LastName = expectedUpdatedPatient.LastName,
                FullName = expectedUpdatedPatient.FullName,
                DateOfBirth = expectedUpdatedPatient.DateOfBirth.ToString(),
                Gender = expectedUpdatedPatient.GenderOptions,
                MedicalRecordNumber = expectedUpdatedPatient.MedicalRecordNumber,
                Email = expectedUpdatedPatient.Email,
                PhoneNumber = expectedUpdatedPatient.PhoneNumber,
                EmergencyContact = expectedUpdatedPatient.EmergencyContact,
                MedicalConditions = expectedUpdatedPatient.MedicalConditions,
                AppointmentHistory = expectedUpdatedPatient.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                IsActive = expectedUpdatedPatient.IsActive
            });
        
            // Act
            var updatedPatientDTO = await _service.UpdatePatient(existingPatient.Id.AsGuid(), dto);
        
            // Assert
            Assert.NotNull(updatedPatientDTO);
            Assert.Equal(expectedUpdatedPatient.FirstName, updatedPatientDTO.FirstName);
            Assert.Equal(expectedUpdatedPatient.LastName, updatedPatientDTO.LastName);
            Assert.Equal(expectedUpdatedPatient.FullName, updatedPatientDTO.FullName);
            Assert.Equal(expectedUpdatedPatient.Email, updatedPatientDTO.Email);
            Assert.Equal(expectedUpdatedPatient.PhoneNumber, updatedPatientDTO.PhoneNumber);
            Assert.Equal(expectedUpdatedPatient.EmergencyContact, updatedPatientDTO.EmergencyContact);
            Assert.Equal(expectedUpdatedPatient.MedicalConditions, updatedPatientDTO.MedicalConditions);
            _patientMapperMock.Verify(m => m.ToDto(It.IsAny<Patient>()), Times.Once);
            _patientRepositoryMock.Verify(r => r.GetByIdAsync(existingPatient.Id), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Once);
        }

        [Fact]
        public async Task UpdatePatientFailsWhenPatientDoesNotExistTest()
        {
            // Arrange
            var nonExistentPatientId = Guid.NewGuid();
            var dto = new UpdatePatientDTO
            {
                FirstName = "NovoNome",
                LastName = "NovoSobrenome",
                FullName = "NovoNome Completo",
                Email = "novoemail@example.com",
                PhoneNumber = "+351912345679",
                EmergencyContact = "+351987654322",
                MedicalConditions = "NovaCondição"
            };

            _patientRepositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<PatientId>())).ReturnsAsync((Patient)null);

            // Act
            var result = await _service.UpdatePatient(nonExistentPatientId, dto);

            // Assert
            Assert.Null(result);
            _patientRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<PatientId>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Never);
            _patientMapperMock.Verify(m => m.ToDto(It.IsAny<Patient>()), Times.Never);
        }

        [Fact]
        public async Task DeletePatientSucceedsWhenPatientExistsTest()
        {
            // Arrange
            var patient = CreateSamplePatient();
            var log = new Log(TypeOfAction.Delete, patient.Id.ToString(), "Patient deleted.");

            _patientRepositoryMock.Setup(r => r.GetByIdAsync(patient.Id)).ReturnsAsync(patient);
            _patientRepositoryMock.Setup(r => r.Remove(patient));
            _logRepositoryMock.Setup(l => l.AddAsync(It.IsAny<Log>())).ReturnsAsync(log);
            _patientMapperMock.Setup(m => m.ToDto(patient)).Returns(new PatientDTO
            {
                Id = patient.Id.AsGuid(),
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                FullName = patient.FullName,
                DateOfBirth = patient.DateOfBirth.ToString(),
                Gender = patient.GenderOptions,
                Email = patient.Email,
                PhoneNumber = patient.PhoneNumber,
                EmergencyContact = patient.EmergencyContact,
                MedicalConditions = patient.MedicalConditions
            });

            // Act
            var deletedPatient = await _service.DeletePatient(patient.Id);

            // Assert
            Assert.NotNull(deletedPatient);
            Assert.Equal(patient.FirstName, deletedPatient.FirstName);
            Assert.Equal(patient.LastName, deletedPatient.LastName);
            Assert.Equal(patient.FullName, deletedPatient.FullName);
            Assert.Equal(patient.DateOfBirth.ToString(), deletedPatient.DateOfBirth);
            Assert.Equal(patient.GenderOptions, deletedPatient.Gender);
            Assert.Equal(patient.Email, deletedPatient.Email);
            Assert.Equal(patient.PhoneNumber, deletedPatient.PhoneNumber);
            Assert.Equal(patient.EmergencyContact, deletedPatient.EmergencyContact);
            Assert.Equal(patient.MedicalConditions, deletedPatient.MedicalConditions);
            _patientRepositoryMock.Verify(r => r.Remove(patient), Times.Once);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            _patientMapperMock.Verify(m => m.ToDto(patient), Times.Once);
        }

        [Fact]
        public async Task DeletePatientFailsWhenPatientDoesNotExistTest()
        {
            // Arrange
            var nonExistentPatientId = new PatientId(Guid.NewGuid());

            _patientRepositoryMock.Setup(r => r.GetByIdAsync(nonExistentPatientId)).ReturnsAsync((Patient)null);

            // Act
            var result = await _service.DeletePatient(nonExistentPatientId);

            // Assert
            Assert.Null(result);
            _patientRepositoryMock.Verify(r => r.Remove(It.IsAny<Patient>()), Times.Never);
            _logRepositoryMock.Verify(l => l.AddAsync(It.IsAny<Log>()), Times.Never);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Never);
            _patientMapperMock.Verify(m => m.ToDto(It.IsAny<Patient>()), Times.Never);
        }

        [Fact]
        public async Task SearchPatientsFiltersByFirstName()
        {
            // Arrange
            var searchDto = new SearchPatientDTO
            {
                FirstName = "Maria",
                LastName = "",
                FullName = "",
                DateOfBirth = "",
                Gender = "",
                MedicalRecordNumber = "",
                Email = "",
                PhoneNumber = ""
            };

            var patients = CreateSamplePatients();

            _patientRepositoryMock.Setup(r => r.SearchPatientsAsync(searchDto)).ReturnsAsync(patients.Where(p => p.FirstName == searchDto.FirstName).ToList());
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns((Patient p) => new PatientDTO
            {
                Id = p.Id.AsGuid(),
                FirstName = p.FirstName,
                LastName = p.LastName,
                FullName = p.FullName,
                DateOfBirth = p.DateOfBirth.ToString(),
                Gender = p.GenderOptions,
                MedicalRecordNumber = p.MedicalRecordNumber,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                EmergencyContact = p.EmergencyContact,
                AppointmentHistory = p.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                MedicalConditions = p.MedicalConditions,
                IsActive = p.IsActive
            });

            var result = await _service.SearchPatients(searchDto);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Maria", result[0].FirstName);
            Assert.Equal("Silva", result[0].LastName);
            Assert.Equal("Maria Silva", result[0].FullName);
            Assert.Equal(new DateOnly(1985, 5, 15).ToString(), result[0].DateOfBirth);
            Assert.Equal(GenderOptions.Female, result[0].Gender);
            Assert.Equal("maria.silva@example.com", result[0].Email);
            Assert.Equal("+351912345678", result[0].PhoneNumber);
            Assert.Equal("+351987654321", result[0].EmergencyContact);
            Assert.Equal("Hipertensão", result[0].MedicalConditions);
            _patientRepositoryMock.Verify(r => r.SearchPatientsAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task SearchPatientsFiltersByLastName()
        {
            // Arrange
            var searchDto = new SearchPatientDTO
            {
                FirstName = "",
                LastName = "Silva",
                FullName = "",
                DateOfBirth = "",
                Gender = "",
                MedicalRecordNumber = "",
                Email = "",
                PhoneNumber = ""
            };

            var patients = CreateSamplePatients();

            _patientRepositoryMock.Setup(r => r.SearchPatientsAsync(searchDto)).ReturnsAsync(patients.Where(p => p.LastName == searchDto.LastName).ToList());
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns((Patient p) => new PatientDTO
            {
                Id = p.Id.AsGuid(),
                FirstName = p.FirstName,
                LastName = p.LastName,
                FullName = p.FullName,
                DateOfBirth = p.DateOfBirth.ToString(),
                Gender = p.GenderOptions,
                MedicalRecordNumber = p.MedicalRecordNumber,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                EmergencyContact = p.EmergencyContact,
                AppointmentHistory = p.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                MedicalConditions = p.MedicalConditions,
                IsActive = p.IsActive
            });

            var result = await _service.SearchPatients(searchDto);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Maria", result[0].FirstName);
            Assert.Equal("Silva", result[0].LastName);
            Assert.Equal("Maria Silva", result[0].FullName);
            Assert.Equal(new DateOnly(1985, 5, 15).ToString(), result[0].DateOfBirth);
            Assert.Equal(GenderOptions.Female, result[0].Gender);
            Assert.Equal("maria.silva@example.com", result[0].Email);
            Assert.Equal("+351912345678", result[0].PhoneNumber);
            Assert.Equal("+351987654321", result[0].EmergencyContact);
            Assert.Equal("Hipertensão", result[0].MedicalConditions);
            _patientRepositoryMock.Verify(r => r.SearchPatientsAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task SearchPatientsFiltersByFullName()
        {
            // Arrange
            var searchDto = new SearchPatientDTO
            {
                FirstName = "",
                LastName = "",
                FullName = "Maria Silva",
                DateOfBirth = "",
                Gender = "",
                MedicalRecordNumber = "",
                Email = "",
                PhoneNumber = ""
            };

            var patients = CreateSamplePatients();

            _patientRepositoryMock.Setup(r => r.SearchPatientsAsync(searchDto)).ReturnsAsync(patients.Where(p => p.FullName == searchDto.FullName).ToList());
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns((Patient p) => new PatientDTO
            {
                Id = p.Id.AsGuid(),
                FirstName = p.FirstName,
                LastName = p.LastName,
                FullName = p.FullName,
                DateOfBirth = p.DateOfBirth.ToString(),
                Gender = p.GenderOptions,
                MedicalRecordNumber = p.MedicalRecordNumber,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                EmergencyContact = p.EmergencyContact,
                AppointmentHistory = p.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                MedicalConditions = p.MedicalConditions,
                IsActive = p.IsActive
            });

            var result = await _service.SearchPatients(searchDto);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Maria", result[0].FirstName);
            Assert.Equal("Silva", result[0].LastName);
            Assert.Equal("Maria Silva", result[0].FullName);
            Assert.Equal(new DateOnly(1985, 5, 15).ToString(), result[0].DateOfBirth);
            Assert.Equal(GenderOptions.Female, result[0].Gender);
            Assert.Equal("maria.silva@example.com", result[0].Email);
            Assert.Equal("+351912345678", result[0].PhoneNumber);
            Assert.Equal("+351987654321", result[0].EmergencyContact);
            Assert.Equal("Hipertensão", result[0].MedicalConditions);
            _patientRepositoryMock.Verify(r => r.SearchPatientsAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task SearchPatientsFiltersByDateOfBirth()
        {
            // Arrange
            var searchDto = new SearchPatientDTO
            {
                FirstName = "",
                LastName = "",
                FullName = "",
                DateOfBirth = "1985/05/15",
                Gender = "",
                MedicalRecordNumber = "",
                Email = "",
                PhoneNumber = ""
            };

            var patients = CreateSamplePatients();

            _patientRepositoryMock.Setup(r => r.SearchPatientsAsync(searchDto)).ReturnsAsync(patients.Where(p => p.DateOfBirth.ToString("yyyy/MM/dd") == searchDto.DateOfBirth).ToList());
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns((Patient p) => new PatientDTO
            {
                Id = p.Id.AsGuid(),
                FirstName = p.FirstName,
                LastName = p.LastName,
                FullName = p.FullName,
                DateOfBirth = p.DateOfBirth.ToString(),
                Gender = p.GenderOptions,
                MedicalRecordNumber = p.MedicalRecordNumber,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                EmergencyContact = p.EmergencyContact,
                AppointmentHistory = p.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                MedicalConditions = p.MedicalConditions,
                IsActive = p.IsActive
            });

            var result = await _service.SearchPatients(searchDto);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Maria", result[0].FirstName);
            Assert.Equal("Silva", result[0].LastName);
            Assert.Equal("Maria Silva", result[0].FullName);
            Assert.Equal(new DateOnly(1985, 5, 15).ToString(), result[0].DateOfBirth);
            Assert.Equal(GenderOptions.Female, result[0].Gender);
            Assert.Equal("maria.silva@example.com", result[0].Email);
            Assert.Equal("+351912345678", result[0].PhoneNumber);
            Assert.Equal("+351987654321", result[0].EmergencyContact);
            Assert.Equal("Hipertensão", result[0].MedicalConditions);
            _patientRepositoryMock.Verify(r => r.SearchPatientsAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task SearchPatientsFiltersByGender()
        {
            // Arrange
            var searchDto = new SearchPatientDTO
            {
                FirstName = "",
                LastName = "",
                FullName = "",
                DateOfBirth = "",
                Gender = "Male",
                MedicalRecordNumber = "",
                Email = "",
                PhoneNumber = ""
            };

            var patients = CreateSamplePatients();

            _patientRepositoryMock.Setup(r => r.SearchPatientsAsync(searchDto)).ReturnsAsync(patients.Where(p => p.GenderOptions.ToString() == searchDto.Gender).ToList());
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns((Patient p) => new PatientDTO
            {
                Id = p.Id.AsGuid(),
                FirstName = p.FirstName,
                LastName = p.LastName,
                FullName = p.FullName,
                DateOfBirth = p.DateOfBirth.ToString(),
                Gender = p.GenderOptions,
                MedicalRecordNumber = p.MedicalRecordNumber,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                EmergencyContact = p.EmergencyContact,
                AppointmentHistory = p.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                MedicalConditions = p.MedicalConditions,
                IsActive = p.IsActive
            });

            var result = await _service.SearchPatients(searchDto);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("João", result[0].FirstName);
            Assert.Equal("Pereira", result[0].LastName);
            Assert.Equal("João Pereira", result[0].FullName);
            Assert.Equal(new DateOnly(1978, 3, 22).ToString(), result[0].DateOfBirth);
            Assert.Equal(GenderOptions.Male, result[0].Gender);
            Assert.Equal("joao.pereira@example.com", result[0].Email);
            Assert.Equal("+351912345679", result[0].PhoneNumber);
            Assert.Equal("+351987654322", result[0].EmergencyContact);
            Assert.Equal("Diabetes", result[0].MedicalConditions);

            Assert.Equal("Pedro", result[1].FirstName);
            Assert.Equal("Ferreira", result[1].LastName);
            Assert.Equal("Pedro Ferreira", result[1].FullName);
            Assert.Equal(new DateOnly(1980, 11, 10).ToString(), result[1].DateOfBirth);
            Assert.Equal(GenderOptions.Male, result[1].Gender);
            Assert.Equal("pedro.ferreira@example.com", result[1].Email);
            Assert.Equal("+351912345681", result[1].PhoneNumber);
            Assert.Equal("+351987654324", result[1].EmergencyContact);
            Assert.Equal("Nenhuma", result[1].MedicalConditions);


            _patientRepositoryMock.Verify(r => r.SearchPatientsAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task SearchPatientsFiltersByMedicalRecordNumber()
        {
            var medicalRecordNumber = $"{DateTime.Now.Year:D4}{DateTime.Now.Month:D2}{"000001"}";
            // Arrange
            var searchDto = new SearchPatientDTO
            {
                FirstName = "",
                LastName = "",
                FullName = "",
                DateOfBirth = "",
                Gender = "",
                MedicalRecordNumber = medicalRecordNumber,
                Email = "",
                PhoneNumber = ""
            };

            var patients = CreateSamplePatients();
            int i = 1;
            foreach (var patient in patients)
            {
                patient.AssignMedicalRecordNumber($"{DateTime.Now.Year:D4}{DateTime.Now.Month:D2}{i:D6}");
                i++;
            }

            _patientRepositoryMock.Setup(r => r.SearchPatientsAsync(searchDto)).ReturnsAsync(patients.Where(p => p.MedicalRecordNumber == searchDto.MedicalRecordNumber).ToList());
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns((Patient p) => new PatientDTO
            {
                Id = p.Id.AsGuid(),
                FirstName = p.FirstName,
                LastName = p.LastName,
                FullName = p.FullName,
                DateOfBirth = p.DateOfBirth.ToString(),
                Gender = p.GenderOptions,
                MedicalRecordNumber = p.MedicalRecordNumber,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                EmergencyContact = p.EmergencyContact,
                AppointmentHistory = p.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                MedicalConditions = p.MedicalConditions,
                IsActive = p.IsActive
            });

            // Act
            var result = await _service.SearchPatients(searchDto);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Maria", result[0].FirstName);
            Assert.Equal("Silva", result[0].LastName);
            Assert.Equal("Maria Silva", result[0].FullName);
            Assert.Equal(new DateOnly(1985, 5, 15).ToString(), result[0].DateOfBirth);
            Assert.Equal(GenderOptions.Female, result[0].Gender);
            Assert.Equal("maria.silva@example.com", result[0].Email);
            Assert.Equal("+351912345678", result[0].PhoneNumber);
            Assert.Equal("+351987654321", result[0].EmergencyContact);
            Assert.Equal("Hipertensão", result[0].MedicalConditions);
            _patientRepositoryMock.Verify(r => r.SearchPatientsAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task SearchPatientsFiltersByEmail()
        {
            // Arrange
            var searchDto = new SearchPatientDTO
            {
                FirstName = "",
                LastName = "",
                FullName = "",
                DateOfBirth = "",
                Gender = "",
                MedicalRecordNumber = "",
                Email = "maria.silva@example.com",
                PhoneNumber = ""
            };

            var patients = CreateSamplePatients();

            _patientRepositoryMock.Setup(r => r.SearchPatientsAsync(searchDto)).ReturnsAsync(patients.Where(p => p.Email == searchDto.Email).ToList());
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns((Patient p) => new PatientDTO
            {
                Id = p.Id.AsGuid(),
                FirstName = p.FirstName,
                LastName = p.LastName,
                FullName = p.FullName,
                DateOfBirth = p.DateOfBirth.ToString(),
                Gender = p.GenderOptions,
                MedicalRecordNumber = p.MedicalRecordNumber,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                EmergencyContact = p.EmergencyContact,
                AppointmentHistory = p.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                MedicalConditions = p.MedicalConditions,
                IsActive = p.IsActive
            });

            var result = await _service.SearchPatients(searchDto);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Maria", result[0].FirstName);
            Assert.Equal("Silva", result[0].LastName);
            Assert.Equal("Maria Silva", result[0].FullName);
            Assert.Equal(new DateOnly(1985, 5, 15).ToString(), result[0].DateOfBirth);
            Assert.Equal(GenderOptions.Female, result[0].Gender);
            Assert.Equal("maria.silva@example.com", result[0].Email);
            Assert.Equal("+351912345678", result[0].PhoneNumber);
            Assert.Equal("+351987654321", result[0].EmergencyContact);
            Assert.Equal("Hipertensão", result[0].MedicalConditions);
            _patientRepositoryMock.Verify(r => r.SearchPatientsAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task SearchPatientsFiltersByPhoneNumber()
        {
            // Arrange
            var searchDto = new SearchPatientDTO
            {
                FirstName = "",
                LastName = "",
                FullName = "",
                DateOfBirth = "",
                Gender = "",
                MedicalRecordNumber = "",
                Email = "",
                PhoneNumber = "+351912345678"
            };

            var patients = CreateSamplePatients();

            _patientRepositoryMock.Setup(r => r.SearchPatientsAsync(searchDto)).ReturnsAsync(patients.Where(p => p.PhoneNumber == searchDto.PhoneNumber).ToList());
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns((Patient p) => new PatientDTO
            {
                Id = p.Id.AsGuid(),
                FirstName = p.FirstName,
                LastName = p.LastName,
                FullName = p.FullName,
                DateOfBirth = p.DateOfBirth.ToString(),
                Gender = p.GenderOptions,
                MedicalRecordNumber = p.MedicalRecordNumber,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                EmergencyContact = p.EmergencyContact,
                AppointmentHistory = p.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                MedicalConditions = p.MedicalConditions,
                IsActive = p.IsActive
            });

            var result = await _service.SearchPatients(searchDto);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Maria", result[0].FirstName);
            Assert.Equal("Silva", result[0].LastName);
            Assert.Equal("Maria Silva", result[0].FullName);
            Assert.Equal(new DateOnly(1985, 5, 15).ToString(), result[0].DateOfBirth);
            Assert.Equal(GenderOptions.Female, result[0].Gender);
            Assert.Equal("maria.silva@example.com", result[0].Email);
            Assert.Equal("+351912345678", result[0].PhoneNumber);
            Assert.Equal("+351987654321", result[0].EmergencyContact);
            Assert.Equal("Hipertensão", result[0].MedicalConditions);
            _patientRepositoryMock.Verify(r => r.SearchPatientsAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task SearchAllPatients()
        {
            // Arrange
            var searchDto = new SearchPatientDTO
            {
                FirstName = "",
                LastName = "",
                FullName = "",
                DateOfBirth = "",
                Gender = "",
                MedicalRecordNumber = "",
                Email = "",
                PhoneNumber = ""
            };

            var patients = CreateSamplePatients();

            _patientRepositoryMock.Setup(r => r.SearchPatientsAsync(searchDto)).ReturnsAsync(patients);
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns((Patient p) => new PatientDTO
            {
                Id = p.Id.AsGuid(),
                FirstName = p.FirstName,
                LastName = p.LastName,
                FullName = p.FullName,
                DateOfBirth = p.DateOfBirth.ToString(),
                Gender = p.GenderOptions,
                MedicalRecordNumber = p.MedicalRecordNumber,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                EmergencyContact = p.EmergencyContact,
                AppointmentHistory = p.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                MedicalConditions = p.MedicalConditions,
                IsActive = p.IsActive
            });

            // Act
            var result = await _service.SearchPatients(searchDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(6, result.Count);

            for (int i = 0; i < patients.Count; i++)
            {
                Assert.Equal(patients[i].FirstName, result[i].FirstName);
                Assert.Equal(patients[i].LastName, result[i].LastName);
                Assert.Equal(patients[i].FullName, result[i].FullName);
                Assert.Equal(patients[i].DateOfBirth.ToString(), result[i].DateOfBirth);
                Assert.Equal(patients[i].GenderOptions, result[i].Gender);
                Assert.Equal(patients[i].Email, result[i].Email);
                Assert.Equal(patients[i].PhoneNumber, result[i].PhoneNumber);
                Assert.Equal(patients[i].EmergencyContact, result[i].EmergencyContact);
                Assert.Equal(patients[i].MedicalConditions, result[i].MedicalConditions);
            }
            _patientRepositoryMock.Verify(r => r.SearchPatientsAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task GetNullListOfPatients()
        {
            var searchDto = new SearchPatientDTO
            {
                FirstName = "",
                LastName = "",
                FullName = "Não Existo",
                DateOfBirth = "",
                Gender = "",
                MedicalRecordNumber = "",
                Email = "",
                PhoneNumber = ""
            };

            var patients = CreateSamplePatients();

            _patientRepositoryMock.Setup(r => r.SearchPatientsAsync(searchDto)).ReturnsAsync(patients.Where(p => p.FullName == searchDto.FullName).ToList());

            var result = await _service.SearchPatients(searchDto);

            Assert.Null(result);
            _patientRepositoryMock.Verify(r => r.SearchPatientsAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task GetListWithMoreThanOneFilter()
        {
            var searchDto = new SearchPatientDTO
            {
                FirstName = "Sofia",
                LastName = "Sousa",
                FullName = "",
                DateOfBirth = "",
                Gender = "",
                MedicalRecordNumber = "",
                Email = "",
                PhoneNumber = ""
            };

            var patients = CreateSamplePatients();

            _patientRepositoryMock.Setup(r => r.SearchPatientsAsync(searchDto)).ReturnsAsync(patients.Where(p => p.FirstName == searchDto.FirstName && p.LastName == searchDto.LastName).ToList());
            _patientMapperMock.Setup(m => m.ToDto(It.IsAny<Patient>())).Returns((Patient p) => new PatientDTO
            {
                Id = p.Id.AsGuid(),
                FirstName = p.FirstName,
                LastName = p.LastName,
                FullName = p.FullName,
                DateOfBirth = p.DateOfBirth.ToString(),
                Gender = p.GenderOptions,
                MedicalRecordNumber = p.MedicalRecordNumber,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                EmergencyContact = p.EmergencyContact,
                AppointmentHistory = p.AppointmentHistory.Select(date => date.ToString("o")).ToArray(),
                MedicalConditions = p.MedicalConditions,
                IsActive = p.IsActive
            });

            var result = await _service.SearchPatients(searchDto);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Sofia", result[0].FirstName);
            Assert.Equal("Sousa", result[0].LastName);
            Assert.Equal("Sofia Sousa", result[0].FullName);
            Assert.Equal(new DateOnly(2000, 3, 24).ToString(), result[0].DateOfBirth);
            Assert.Equal(GenderOptions.Female, result[0].Gender);
            Assert.Equal("sofia.sousa@example.com", result[0].Email);
            Assert.Equal("+351912345681", result[0].PhoneNumber);
            Assert.Equal("+351987654327", result[0].EmergencyContact);
            Assert.Equal("Alergias", result[0].MedicalConditions);
            _patientRepositoryMock.Verify(r => r.SearchPatientsAsync(searchDto), Times.Once);
        }
    }
}