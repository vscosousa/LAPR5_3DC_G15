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
        private string _specOption;
        private List<Staff> _staffs;
        private List<OperationType> _operationTypes;

        public Specialization(string specOption)
        {
            Id = new SpecializationId(Guid.NewGuid());
            _specOption = specOption;
            _staffs = new List<Staff>();
            _operationTypes = new List<OperationType>();
        }

        //getters
        public string SpecOption => _specOption;
        public List<Staff> Staffs => _staffs;
        public List<OperationType> OperationTypes => _operationTypes;

        internal void AddStaff(Staff staff)
        {
            if (staff == null)
            {
                throw new ArgumentNullException(nameof(staff));
            }

            if (_staffs == null)
            {
                _staffs = new List<Staff>();
            }

            _staffs.Add(staff);
        }

        internal void SetId(SpecializationId specializationId)
        {
            Id = specializationId;
        }
    }
}
