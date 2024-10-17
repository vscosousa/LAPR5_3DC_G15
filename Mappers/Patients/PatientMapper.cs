using System;
using System.Linq;
using DDDSample1.Domain.Patients;
using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace Projetos.LAPR5_3DC_G15.Mappers.Patients
{
    public class PatientMapper : IMapper<Patient, PatientDTO, CreatingPatientDTO>, IPatientMapper
    {
        public PatientDTO ToDto(Patient domain)
        {
            return new PatientDTO
            {
                Id = domain.Id.AsGuid(),
                FirstName = domain.FirstName,
                LastName = domain.LastName,
                FullName = domain.FullName,
                DateOfBirth = domain.DateOfBirth.ToString(),
                Gender = domain.GenderOptions,
                MedicalRecordNumber = domain.MedicalRecordNumber.ToString(),
                Email = domain.Email,
                PhoneNumber = domain.PhoneNumber,
                EmergencyContact = domain.EmergencyContact,
                MedicalConditions = domain.MedicalConditions,
                AppointmentHistory = domain.AppointmentHistory.Select(date => date.ToString()).ToArray(),
                IsActive = domain.IsActive
            };
        }

        public Patient ToDomain(CreatingPatientDTO dto)
        {
            return new Patient(
                dto.FirstName,
                dto.LastName,
                dto.FullName,
                DateOnly.Parse(dto.DateOfBirth),
                dto.Gender,
                dto.MedicalRecordNumber,
                dto.Email,
                dto.PhoneNumber,
                dto.EmergencyContact,
                dto.MedicalConditions,
                dto.AppointmentHistory.Select(date => DateTime.Parse(date)).ToArray()
            );
        }

        public CreatingPatientDTO ToCreatingDto(Patient domain)
        {
            return new CreatingPatientDTO
            {
                FirstName = domain.FirstName,
                LastName = domain.LastName,
                FullName = domain.FullName,
                DateOfBirth = domain.DateOfBirth.ToString(),
                Gender = domain.GenderOptions,
                MedicalRecordNumber = domain.MedicalRecordNumber,
                Email = domain.Email,
                PhoneNumber = domain.PhoneNumber,
                EmergencyContact = domain.EmergencyContact,
                MedicalConditions = domain.MedicalConditions,
                AppointmentHistory = domain.AppointmentHistory.Select(date => date.ToString()).ToArray()
            };
        }
    }
}