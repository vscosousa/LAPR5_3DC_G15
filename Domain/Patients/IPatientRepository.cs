using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public interface IPatientRepository : IRepository<Patient, PatientId>
    {
        Task<Patient> GetByEmailAsync(string email);
        Task<Patient> GetByPhoneNumberAsync(string phoneNumber);
        Task<List<Patient>> SearchPatientsAsync(SearchPatientDTO dto);
    }
}