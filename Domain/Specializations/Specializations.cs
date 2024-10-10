using System;
using System.Collections;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.Specializations
{
    public class Specialization : Entity<SpecializationId>, IAggregateRoot
    {
        private SpecializationOption _SpecOption;
        private List<Staff> _Staff;

        // Construtor sem parâmetros para EF Core
        private Specialization() { }

        public Specialization(SpecializationOption option, List<Staff> staff)
        {
            Id = new SpecializationId(Guid.NewGuid());
            _SpecOption = option;
            _Staff=staff;
        }

        // Getters públicos
        public SpecializationOption SpecOption => _SpecOption;

        public List<Staff> Staff=>_Staff;
        
    }
}
