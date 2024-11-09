using System.Collections.Generic;

public class CreatingOperationTypeDTO
{
    public string Name { get; set; }
    public string EstimatedDuration { get; set; }
    public List<string> Specializations { get; set; } // List of specialization names.

    public CreatingOperationTypeDTO() { }

    public CreatingOperationTypeDTO(string name, string estimatedDuration, List<string> specializations)
    {
        Name = name;
        EstimatedDuration = estimatedDuration;
        Specializations = specializations; 
    }
}
