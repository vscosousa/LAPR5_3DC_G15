using System;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace Projetos.LAPR5_3DC_G15.Mappers.Patients
{
    public class OperationRequestMapper : IMapper<OperationRequest, OperationRequestDTO, CreatingOperationRequestDTO>, IOperationRequestMapper
    {
        public OperationRequestDTO ToDto(OperationRequest domain)
        {
            return new OperationRequestDTO
            {
                Id = domain.Id.AsGuid(),
                DeadlineDate = domain.DeadlineDate.ToString(),
                Priority = domain.Priority.ToString(),
                Status = domain.Status.ToString(),
                PatientMedicalRecordNumber = domain.Patient.MedicalRecordNumber,
                DoctorLicenseNumber = domain.Doctor.LicenseNumber,
                OperationType = domain.OperationType.Id.ToString()
            };
        }

        public OperationRequest ToDomainQ(CreatingOperationRequestDTO dto, Guid patientId, Guid doctorId, Guid operationTypeId)
        {
            return new OperationRequest(
                DateOnly.Parse(dto.DeadlineDate),
                (Priority)Enum.Parse(typeof(Priority), dto.Priority),
                new PatientId(patientId),
                new StaffId(doctorId),
                new OperationTypeId(operationTypeId)
            );
        }

        public CreatingOperationRequestDTO ToCreatingDto(OperationRequest domain)
        {
            return new CreatingOperationRequestDTO
            {
                DeadlineDate = domain.DeadlineDate.ToString(),
                Priority = domain.Priority.ToString(),
                PatientMedicalRecordNumber = domain.Patient.MedicalRecordNumber,
                DoctorLicenseNumber = domain.Doctor.LicenseNumber,
                OperationType = domain.OperationType.Id.ToString()
            };
        }

        public SearchedOperationRequestDTO ToSearchedDTO(OperationRequest input, string patientName, string doctorLicenseNumber)
        {
            return new SearchedOperationRequestDTO(
                patientName,
                input.Id.AsGuid(),
                input.OperationTypeId.ToString(),
                input.Status.ToString(),
                input.Priority.ToString(),
                doctorLicenseNumber,
                input.DeadlineDate.ToString()
            );
        }

        public OperationRequest ToDomain(CreatingOperationRequestDTO dto)
        {
            throw new NotImplementedException();
        }
    }
}