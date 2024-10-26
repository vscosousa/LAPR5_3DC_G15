using System;

namespace DDDSample1.Domain.Staffs
{
    public class CreatingStaffDTO
    {
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public string FullName { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public string SpecializationName { get; init; }
        public Guid SpecializationId { get; set; }

        public CreatingStaffDTO() { }
        public CreatingStaffDTO(string firstName, string lastName, string fullName, string email, string phoneNumber, string specializationName)
         {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            SpecializationName = specializationName;
        }

        public void SetSpecializationId(Guid specializationId)
        {
            SpecializationId = specializationId;
        }
    }
}
