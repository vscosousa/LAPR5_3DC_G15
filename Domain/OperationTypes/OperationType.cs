using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationType : Entity<OperationTypeId>, IAggregateRoot
    {
        private string _name;
        //private List<Staff> _staffBySpecialization;
        private string _estimatedDuration;

        public OperationType(string name, string estimatedDuration)
        {
            Id = new OperationTypeId(Guid.NewGuid());
            _name = name;
            _estimatedDuration = estimatedDuration;
            
        }
 


        protected OperationType()
        {
        }

        public string Name => _name;
        public string EstimatedDuration => _estimatedDuration;

    }

}