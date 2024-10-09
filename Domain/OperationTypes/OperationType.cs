using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationType : Entity<OperationTypeId>, IAggregateRoot
    {
        private Name _name;
        //private List<Staff> _staffBySpecialization;
        private EstimatedDuration _estimatedDuration;

        public OperationType(Name name, EstimatedDuration estimatedDuration)
        {
            Id = new OperationTypeId(Guid.NewGuid());
            _name = name;
            _estimatedDuration = estimatedDuration;
            
        }
 


        protected OperationType()
        {
        }

        public Name Name => _name;
        public EstimatedDuration EstimatedDuration => _estimatedDuration;

    }

}