using System;

namespace DDDSample1.Domain.Staffs
{
    public class SearchStaffDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string SpecializationName { get; set; }
        public Guid SpecializationId { get; private set; }

        public SearchStaffDTO() { }

        public SearchStaffDTO(string firstName, string lastName, string fullName, string email, string specializationName)
        {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            SpecializationName = specializationName;
        }

        public void SetSpecializationId(Guid specializationId)
        {
            SpecializationId = specializationId;
        }

        
    }
}
