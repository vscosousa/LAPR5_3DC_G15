namespace DDDSample1.Domain.OperationTypes
{
    public class CreatingOperationTypeDTO
    {
        public string Name { get; set; }
        public string EstimatedDuration { get; set; }

        public CreatingOperationTypeDTO(string name, string estimatedDuration)
        {
            Name = name;
            EstimatedDuration = estimatedDuration;
        }

        public CreatingOperationTypeDTO()
        {
        }

        
    }

}