using System;
using System.Collections.Generic;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationTypeDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string EstimatedDuration { get; set; }

        // Change this to hold Specialization objects with both id and name
        public List<Specialization> Specializations { get; set; }

        public List<StaffDTO> Staffs { get; set; }

        // Constructor to initialize the properties
        public OperationTypeDTO() { }

        public OperationTypeDTO(Guid id, string name, string estimatedDuration, List<Specialization> specializations, List<StaffDTO> staffs)
        {
            Id = id;
            Name = name;
            EstimatedDuration = estimatedDuration;
            Specializations = specializations; // This will now contain Specialization objects
            Staffs = staffs;
        }
    }
}
