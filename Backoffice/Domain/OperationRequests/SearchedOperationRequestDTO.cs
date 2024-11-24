using System;
using Microsoft.AspNetCore.Components.Server;

namespace DDDSample1.Domain.Patients
{
    public class SearchedOperationRequestDTO
    {
        public string PatientName { get; init; }

        public Guid Id{get; init; }
        public string OperationType { get; init; }
        public string Status { get; init; }
        public string Priority { get; init; }
        public string DoctorLicenseNumber { get; init; }
        public string DeadlineDate { get; init; }


        
        public SearchedOperationRequestDTO() { }

        public SearchedOperationRequestDTO(string patientName, Guid id, string operationType, string status, string priority, string doctorLicenseNumber, string deadlineDate){

            PatientName = patientName;
            Id = id;
            OperationType = operationType;
            Status = status;
            Priority = priority;
            DoctorLicenseNumber = doctorLicenseNumber;
            DeadlineDate = deadlineDate;
        }
    }
}