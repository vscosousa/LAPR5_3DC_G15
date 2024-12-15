using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Logs;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repo;
        private readonly IOperationRequestMapper _mapper;
        private readonly IPatientRepository _patientRepo;
        private readonly IStaffRepository _staffRepo;
        private readonly IOperationTypeRepository _operationTypeRepo;
        private readonly ILogRepository _logRepo;

        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo, IOperationRequestMapper mapper, IPatientRepository patientRepo, IStaffRepository staffRepo, IOperationTypeRepository operationTypeRepo, ILogRepository logRepo)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _mapper = mapper;
            _patientRepo = patientRepo;
            _staffRepo = staffRepo;
            _operationTypeRepo = operationTypeRepo;
            _logRepo = logRepo;
        }

        public async Task<OperationRequestDTO> AddOperationRequestAsync(CreatingOperationRequestDTO operationRequestDto)
        {
            try
            {
                
               
                var patient = await _patientRepo.GetByMedicalRecordNumberAsync(operationRequestDto.PatientMedicalRecordNumber);
                if (patient == null)
                {
                    throw new BusinessRuleValidationException("The patient does not exist in the system.");
                }
                var doctor = await _staffRepo.GetByLicenseNumberAsync(operationRequestDto.DoctorLicenseNumber);
                if (doctor == null || doctor.StaffType != StaffType.Doctor)
                {
                    throw new BusinessRuleValidationException("The doctor does not exist in the system.");
                }
                var operationType = await _operationTypeRepo.GetByNameAsync(operationRequestDto.OperationType);
                if (operationType == null)
                {
                    throw new BusinessRuleValidationException("The operation type does not exist in the system.");
                }
                 var operationRequest = _mapper.ToDomainQ(operationRequestDto, patient.Id.AsGuid(), doctor.Id.AsGuid(), operationType.Id.AsGuid() );
                await _repo.AddAsync(operationRequest);

                patient.AddOperationRequest(operationRequest.DeadlineDate.ToDateTime(TimeOnly.MinValue));
                await _patientRepo.UpdateAsync(patient);

                await _unitOfWork.CommitAsync();
                Console.WriteLine("Transaction committed successfully");

                var operationRequestDTO = _mapper.ToDto(operationRequest);

                return operationRequestDTO;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        public async Task<OperationRequestDTO> UpdateOperationRequestAsync(Guid id, Guid doctorId, UpdatingOperationRequestDTO operationRequestDto)
        {
            try
            {
                var doctor = await _staffRepo.GetByIdAsync(new StaffId(doctorId));
                var operationRequest = await _repo.GetByIdAsync(new OperationRequestId(id));
                if (doctorId != operationRequest.DoctorId.AsGuid())
                {
                    throw new BusinessRuleValidationException("You are not allowed to update this operation request, as you are not the doctor assigned to it.");
                }
                if (operationRequest == null)
                {
                    return null;
                }

                var updatedFields = new List<string>();

                var updateActions = new Dictionary<string, Action>
                {
                    { "Deadline Date", () => { if (!string.IsNullOrEmpty(operationRequestDto.DeadlineDate) && operationRequest.DeadlineDate.ToString() != operationRequestDto.DeadlineDate) { operationRequest.ChangeDeadline(operationRequestDto.DeadlineDate); updatedFields.Add("Deadline Date"); } } },
                    { "Priority", () => { if (!string.IsNullOrEmpty(operationRequestDto.Priority) && operationRequestDto.Priority != operationRequest.Priority.ToString()) { operationRequest.ChangePriority(operationRequestDto.Priority); updatedFields.Add("Priority"); } } },
                };

                foreach (var action in updateActions.Values)
                {
                    action();
                }

                if (updatedFields.Count > 0)
                {
                    await _repo.UpdateAsync(operationRequest);
                    string message = "Operation Request updated. The following fields were updated: " + string.Join(", ", updatedFields) + ".";
                    var log = new Log(TypeOfAction.Update, operationRequest.Id.ToString(), message);
                    await _logRepo.AddAsync(log);
                    await _unitOfWork.CommitAsync();
                    Console.WriteLine("Transaction committed successfully");
                }

                var operationRequestDTO = _mapper.ToDto(operationRequest);
                return operationRequestDTO;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        public async Task<bool> ScheduleOperationRequest(Guid id)
        {
            try
            {
                var operationRequest = await _repo.GetByIdAsync(new OperationRequestId(id));
                if (operationRequest == null)
                {
                    return false;
                }

                if (operationRequest.Status != OperationRequestStatus.Pending)
                {
                    throw new BusinessRuleValidationException("You are not allowed to schedule this operation request, as it is already scheduled or was cancelled.");
                }

                operationRequest.ChangeStatus(OperationRequestStatus.Accepted.ToString());
                await _repo.UpdateAsync(operationRequest);
                var log = new Log(TypeOfAction.Update, operationRequest.Id.ToString(), "Operation Request scheduled.");
                await _logRepo.AddAsync(log);
                await _unitOfWork.CommitAsync();
                Console.WriteLine("Transaction committed successfully");

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }
        internal async Task<OperationRequestDTO> RemoveOperationRequestAsync(Guid id, string doctorLicenseNumber )
        {
            try
            {
                var doctor = await _staffRepo.GetByLicenseNumberAsync(doctorLicenseNumber);
                var operationRequest = await _repo.GetByIdAsync(new OperationRequestId(id));
                var patient = await _patientRepo.GetByIdAsync(operationRequest.PatientId);
                if (id != operationRequest.DoctorId.AsGuid())
                {
                    throw new BusinessRuleValidationException("You are not allowed to delete this operation request, as you are not the doctor assigned to it.");
                }
                if (operationRequest == null)
                {
                    return null;
                }

                if (operationRequest.Status != OperationRequestStatus.Pending)
                {
                    throw new BusinessRuleValidationException("You are not allowed to delete this operation request, as it is already scheduled.");
                }

                _repo.Remove(operationRequest);
                patient.RemoveOperationRequest(operationRequest.DeadlineDate.ToDateTime(TimeOnly.MinValue));
                await _patientRepo.UpdateAsync(patient);
                var log = new Log(TypeOfAction.Delete, operationRequest.Id.ToString(), "Operation Request deleted.");
                await _logRepo.AddAsync(log);
                await _unitOfWork.CommitAsync();
                Console.WriteLine("Transaction committed successfully");

                var operationRequestDTO = _mapper.ToDto(operationRequest);
                return operationRequestDTO;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        public async Task<List<SearchedOperationRequestDTO>> SearchOperationRequests(SearchOperationRequestDTO dto)
        {
            var operationRequests = await _repo.SearchOperationRequestsAsync(dto);
            if (operationRequests == null || operationRequests.Count == 0)
            {
                return null;
            }

            var list = new List<SearchedOperationRequestDTO>();
            foreach (var operationRequest in operationRequests)
            {
                var patient = await _patientRepo.GetByIdAsync(operationRequest.PatientId);
                var doctor = await _staffRepo.GetByIdAsync(operationRequest.DoctorId);
                var operationType = await _operationTypeRepo.GetByIdAsync(operationRequest.OperationTypeId);
                var searchedOperationRequestDTO = _mapper.ToSearchedDTO(operationRequest, patient.FullName, doctor.LicenseNumber, operationType.Name);
                list.Add(searchedOperationRequestDTO);
            }
            return list;
        }
    }
}
