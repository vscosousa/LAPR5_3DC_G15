using System;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationTypeDTO
    {
        public Guid Id { get; set; }
        public Name Name { get; set; }
        public EstimatedDuration EstimatedDuration { get; set; }


        public OperationTypeDTO(Guid id, Name name, EstimatedDuration estimatedDuration)
        {
            Id = id;
            Name = name;
            EstimatedDuration = estimatedDuration;
        }

        // Static method to convert a domain OperationType entity to a OperationTypeDTO
        public static OperationTypeDTO FromDomain(OperationType operationType)
        {
            return new OperationTypeDTO(
                Guid.Parse(operationType.Id.Value),
                operationType.Name,
                operationType.EstimatedDuration
            );
        }
    }

}