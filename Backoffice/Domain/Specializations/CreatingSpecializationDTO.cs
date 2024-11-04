using System.Collections.Generic;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.Specializations
{
    public class CreatingSpecializationDTO
    {
        
        public string SpecOption { get; set; }


        public CreatingSpecializationDTO(){}
        public CreatingSpecializationDTO(string specOption){
            SpecOption = specOption;
        }
    }
}
