using System.Collections.Generic;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.Specializations
{
    public class CreatingSpecializationDTO
    {
        
        public string SpecOption { get; set; }

        public List<CreatingStaffDTO> Staffs { get; set; }

        public CreatingSpecializationDTO(string specOption, List<CreatingStaffDTO> staffs){
            SpecOption = specOption;
            Staffs = staffs;
        }
    }
}
