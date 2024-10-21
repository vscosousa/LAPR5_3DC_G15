using System;
using System.Collections.Generic;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationTypeDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string EstimatedDuration { get; set; }
        public List<Guid> Specializations { get; set; } // List of specialization types.
        public List<StaffDTO> Staffs { get; set; }


    
        public OperationTypeDTO(Guid id, string name, string estimatedDuration, List<Guid> specializations, List<StaffDTO> staffs)
        {
            Id = id;
            Name = name;
            EstimatedDuration = estimatedDuration;
            Specializations = specializations;
            Staffs = staffs;
        }

        
    }
}