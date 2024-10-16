using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.Specializations
{
    public class SpecializationDTO{
        
        public Guid id { get; set; }
        public string SpecOption { get; set; }
        public List<string> Staff { get; set; }

        public SpecializationDTO() { }

        public SpecializationDTO(Guid id, string specOption, List<string> staff){
            this.id = id;
            SpecOption = specOption;
            Staff = staff;
        }
    }
}