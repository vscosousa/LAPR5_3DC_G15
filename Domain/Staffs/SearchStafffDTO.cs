namespace DDDSample1.Domain.Staffs
{
    public class SearchStaffDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string SpecializationId { get; set; }

        public SearchStaffDTO() { }

        public SearchStaffDTO(string firstName, string lastName, string email, string specializationId)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            SpecializationId = specializationId;
        }
    }
}
