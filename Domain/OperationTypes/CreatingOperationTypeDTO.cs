using System.Collections.Generic;

namespace DDDSample1.Domain.OperationTypes
{
    public class CreatingOperationTypeDTO
    {
        public string Name { get; set; }
        public string EstimatedDuration { get; set; }
        public List<string> Specializations { get; set; } // List of specialization names or IDs

        public CreatingOperationTypeDTO(string name, string estimatedDuration, List<string> specializations)
        {
            Name = name;
            EstimatedDuration = estimatedDuration;
            Specializations = specializations ?? new List<string>();
        }

        public CreatingOperationTypeDTO()
        {
            Specializations = new List<string>();
        }
    }
}
