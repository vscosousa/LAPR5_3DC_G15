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
                MedicalHistory = domain.MedicalHistory,
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
                dto.GenderOptions,
                dto.Email,
                dto.PhoneNumber,
                dto.EmergencyContact
            );
        }

        public Patient ToDomain(UpdatePatientDTO dto, Patient existingPatient)
        {
            return new Patient(
                dto.FirstName,
                dto.LastName,
                dto.FullName,
                existingPatient.DateOfBirth,
                existingPatient.GenderOptions,
                dto.Email,
                dto.PhoneNumber,
                dto.EmergencyContact
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
                GenderOptions = domain.GenderOptions,
                Email = domain.Email,
                PhoneNumber = domain.PhoneNumber,
                EmergencyContact = domain.EmergencyContact,
            };
        }
    }
}