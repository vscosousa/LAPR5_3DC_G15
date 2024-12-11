using System;
using DDDSample1.Domain.Patients;
using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace DDDSample1.Domain.OperationRequests
{
    public interface IOperationRequestMapper : IMapper<OperationRequest, OperationRequestDTO, CreatingOperationRequestDTO>
    {
        SearchedOperationRequestDTO ToSearchedDTO(OperationRequest input, string patientName, string DoctorLicenseNumber, string OperationTypeName);
        OperationRequest ToDomainQ(CreatingOperationRequestDTO dto, Guid patientId, Guid doctorId, Guid operationTypeId);

    }
}