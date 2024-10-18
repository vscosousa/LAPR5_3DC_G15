using System;
using System.Collections.Generic;
using System.Linq;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.Specializations
{
    public class Specialization : Entity<SpecializationId>, IAggregateRoot
    {
        public SpecializationOption SpecOption;
        public List<Staff> Staffs;

        public List<OperationType> OperationTypes;



        public Specialization(SpecializationOption specOption)
        {
            Id = new SpecializationId(Guid.NewGuid());
            SpecOption = specOption;
            Staffs = new List<Staff>();
            OperationTypes = new List<OperationType>();
        }

        internal void addStaff(List<Staff> staffs)
        {
            if (staffs == null || !staffs.Any())
            {
                throw new ArgumentException("Staff list cannot be null or empty.");
            }

            foreach (var staff in staffs)
            {
                // Set the specialization for each staff member
                staff.SetSpecialization(this);

                // Add staff to the Staffs list
                Staffs.Add(staff);
            }
        }
    }
}
