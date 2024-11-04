using System;
using System.Collections.Generic;
using System.Linq;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationType : Entity<OperationTypeId>, IAggregateRoot
    {
        private string _name;
        private string _estimatedDuration;
        public List<Specialization> Specializations { get; private set; }

        public List<Staff> Staffs;

        private bool _isActive;


        public OperationType(string Name, string EstimatedDuration)
        {
            Id = new OperationTypeId(Guid.NewGuid());
            _name = Name;
            _estimatedDuration = EstimatedDuration;
            Specializations = new List<Specialization>();
            Staffs = new List<Staff>();
            _isActive = true;
        }

        public string Name => _name;
        public string EstimatedDuration => _estimatedDuration;

        public bool IsActive => _isActive;

        public void AddSpecialization(Specialization specialization)
        {
            if (specialization == null)
                throw new ArgumentNullException(nameof(specialization));

            Specializations.Add(specialization);
        }

        // Alternatively, to add a list of specializations
        public void AddSpecializations(IEnumerable<Specialization> specializations)
        {
            if (specializations == null || !specializations.Any())
                throw new ArgumentNullException(nameof(specializations));

            Specializations.AddRange(specializations);
        }

        public void AddStaffs(List<Staff> staffs) // Method to add staffs
        {
            Staffs.AddRange(staffs);
        }
        
        internal void Activate()
        {
            _isActive = true;
        }

        internal void Deactivate()
        {
            _isActive = false;
        }

        internal void UpdateName(string name)
        {
            _name = name;
        }

        internal void UpdateEstimatedDuration(string estimatedDuration)
        {
            _estimatedDuration = estimatedDuration;
        }

        internal void UpdateSpecializations(List<Specialization> specializations)
        {
            if (specializations == null || specializations.Count == 0)
            {
                throw new ArgumentException("Specializations list cannot be null or empty.");
            }

            this.Specializations.Clear();

            foreach (var specialization in specializations)
            {
                this.Specializations.Add(specialization);
            }
        }

        
    }
}

