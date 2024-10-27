using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staffs;
using DDDSample1.Domain.SurgeryRooms;
using Domain.Appointments;
using DDDSample1.Domain.OperationRequests;
using Domain.SurgeryRooms;
using DDDSample1.Domain.OperationTypes;
using Projetos.LAPR5_3DC_G15.Domain.Shared;

namespace DDDSample1.Domain.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _repo;
        private readonly IMapper<Appointment, AppointmentDTO, CreatingAppointmentDTO> _mapper;
        private readonly IPatientRepository _patientRepo;
        private readonly IStaffRepository _staffRepo;
        private readonly ISurgeryRoomRepository _surgeryRoomRepo;
        private readonly IOperationRequestRepository _requestRepo;
        private readonly IOperationTypeRepository _operationTypeRepo;

        public AppointmentService(IUnitOfWork unitOfWork, 
            IAppointmentRepository repo,
            IPatientRepository patientRepo,
            IStaffRepository staffRepo,
            ISurgeryRoomRepository surgeryRoomRepo,
            IOperationRequestRepository requestRepo,
            IOperationTypeRepository operationTypeRepo,
            IMapper<Appointment, AppointmentDTO, CreatingAppointmentDTO> mapper)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _mapper = mapper;
            _patientRepo = patientRepo;
            _staffRepo = staffRepo;
            _surgeryRoomRepo = surgeryRoomRepo;
            _requestRepo = requestRepo;
            _operationTypeRepo = operationTypeRepo;
        }

        public async Task<AppointmentDTO> CreateAsync(CreatingAppointmentDTO dto)
        {
            // Additional validations needed:
            
            // 1. Validate operation request exists and matches
            var request = await _requestRepo.GetByIdAsync(dto.RequestId);
            if (request == null)
                throw new BusinessRuleValidationException("Invalid operation request");

            // 2. Validate all staff specializations match the operation type
            foreach (var staffId in dto.AssignedStaffIds)
            {
                var staff = await _staffRepo.GetByIdAsync(new StaffId(staffId));
                if (!staff.Specialization.Equals(request.OperationTypeId))
                    throw new BusinessRuleValidationException("Staff specialization doesn't match operation type");
            }

            // 3. Check for staff availability
            if (await _repo.ExistsConflictingStaffAppointmentAsync(dto.DateTime, dto.AssignedStaffIds))
                throw new BusinessRuleValidationException("One or more staff members are not available at this time");

            // 4. Check room availability and type compatibility
            var room = await _surgeryRoomRepo.GetByIdAsync(new SurgeryRoomId(dto.SurgeryRoomId));
            var operationType = await _operationTypeRepo.GetByIdAsync(request.OperationTypeId);
            var endTime = dto.DateTime.AddHours(Convert.ToDouble(operationType.EstimatedDuration));
            if (!room.IsAvailable(dto.DateTime, endTime) || !room.CanHandleOperationType(request.OperationTypeId))
                throw new BusinessRuleValidationException("Room is not available or not suitable for this operation type");

            // Create and save the appointment
            var staffIds = dto.AssignedStaffIds.Select(id => new StaffId(id)).ToList();
            var appointment = new Appointment(new AppointmentId(Guid.NewGuid()), dto.RequestId, dto.DateTime, new SurgeryRoomId(dto.SurgeryRoomId), AppointmentStatus.Scheduled, staffIds);
            await _repo.AddAsync(appointment);
            await _unitOfWork.CommitAsync();
            
            return _mapper.ToDto(appointment);
        }
    }
}
