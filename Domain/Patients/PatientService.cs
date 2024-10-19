using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using DDDSample1.Domain.Logs;

namespace DDDSample1.Domain.Patients
{
    public class PatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _repo;
        private readonly IPatientMapper _mapper;
        private readonly ILogRepository _logRepository;

        public PatientService(IUnitOfWork unitOfWork, IPatientRepository repo, IPatientMapper mapper, ILogRepository logRepository)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _mapper = mapper;
            _logRepository = logRepository;
        }

        public async Task<Patient> CreatePatient(CreatingPatientDTO dto)
        {
            try
            {
                var patient = _mapper.ToDomain(dto);
                
                if (await _repo.GetUserByEmailAsync(patient.Email) != null)
                    throw new BusinessRuleValidationException("A patient with the same email already exists.");

                if (await _repo.GetUserByPhoneNumberAsync(patient.PhoneNumber) != null)
                    throw new BusinessRuleValidationException("A patient with the same phone number already exists.");

                var list = await _repo.GetAllAsync();
                patient.AssignMedicalRecordNumber(MedicalRecordNumberGenerator.GenerateMedicalRecordNumber(list.Count));
                await _repo.AddAsync(patient);
                await _unitOfWork.CommitAsync();
                Console.WriteLine("Transaction committed successfully");

                return patient;
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

        public async Task<PatientDTO> DeletePatient(PatientId id)
        {
            var patient = await _repo.GetByIdAsync(id);

            if (patient == null)
                return null;

            _repo.Remove(patient);

            var log = new Log(TypeOfAction.Delete, id.AsString(), "Patient deleted.");
            await _logRepository.AddAsync(log);

            await _unitOfWork.CommitAsync();

            return _mapper.ToDto(patient);
        }

        public async Task<PatientDTO> UpdatePatient(PatientDTO dto)
        {
            var patient = await _repo.GetByIdAsync(new PatientId(dto.Id));

            if (patient == null)
                return null;

            patient.ChangeFirstName(dto.FirstName);

            await _unitOfWork.CommitAsync();

            return _mapper.ToDto(patient);
        }

        public async Task<List<PatientDTO>> GetAllPatients()
        {
            var list = await _repo.GetAllAsync();

            var listDto = list.ConvertAll(_mapper.ToDto);

            return listDto;
        }
    }
}
