using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.OperationTypes
{
    public class CreatingOperationTypeDTO
    {
        public string Name { get; set; }
        public string EstimatedDuration { get; set; }
        public List<Guid> Specializations { get; set; } // List of specialization types.


        public CreatingOperationTypeDTO(){}
        public CreatingOperationTypeDTO(string name, string estimatedDuration, List<Guid> specializations)
        {
            Name = name;
            EstimatedDuration = estimatedDuration;
            Specializations = specializations; 

        }
    }
}
