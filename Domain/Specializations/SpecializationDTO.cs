using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Staffs;
using Newtonsoft.Json;

namespace DDDSample1.Domain.Specializations
{
    public class SpecializationDTO{
        
        public Guid Id { get; set; }
        public string SpecOption { get; set; }
        public List<Staff> Staff { get; set; }

        public SpecializationDTO() { }

        public SpecializationDTO(Guid id, string specOption, List<Staff> staff){
            Id = id;
            SpecOption = specOption;
            Staff = staff;
        }
    }
}