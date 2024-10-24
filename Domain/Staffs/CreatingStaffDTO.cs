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
        public string SpecializationId { get; init; }

        public CreatingStaffDTO() { }
         public CreatingStaffDTO(string firstName, string lastName, string fullName, string email, string phoneNumber, string specializationId)
         {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            SpecializationId = specializationId;
        }
    }
}
