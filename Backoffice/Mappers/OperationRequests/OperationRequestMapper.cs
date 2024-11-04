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
                PatientId = domain.PatientId.AsGuid(),
                DoctorId = domain.DoctorId.AsGuid(),
                OperationTypeId = domain.OperationTypeId.AsGuid()
            };
        }

        public OperationRequest ToDomain(CreatingOperationRequestDTO dto)
        {
            return new OperationRequest(
                DateOnly.Parse(dto.DeadlineDate),
                (Priority)Enum.Parse(typeof(Priority), dto.Priority),
                new PatientId(dto.PatientId),
                new StaffId(dto.DoctorId),
                new OperationTypeId(dto.OperationTypeId)
            );
        }

        public CreatingOperationRequestDTO ToCreatingDto(OperationRequest domain)
        {
            return new CreatingOperationRequestDTO
            {
                DeadlineDate = domain.DeadlineDate.ToString(),
                Priority = domain.Priority.ToString(),
                PatientId = domain.PatientId.AsGuid(),
                DoctorId = domain.DoctorId.AsGuid(),
                OperationTypeId = domain.OperationTypeId.AsGuid()   
            };
        }

        public SearchedOperationRequestDTO ToSeachedDTO(OperationRequest input, string patientName)
        {
            return new SearchedOperationRequestDTO(
                patientName,
                input.OperationTypeId.ToString(),
                input.Status.ToString(),
                input.Priority.ToString(),
                input.DoctorId.ToString(),
                input.DeadlineDate.ToString()
            );
        }
    }
}