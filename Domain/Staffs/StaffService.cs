using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using System;
using DDDSample1.Domain.Specializations;
using DDDSample1.Infrastructure.Specializations;
using System.Linq;
using DDD.sample1.Domain.Staffs;

namespace DDDSample1.Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _repository;

        private readonly ISpecializationRepository _specializationRepository;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repository, ISpecializationRepository specializationRepository)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _specializationRepository = specializationRepository;
        }
        
    }
}