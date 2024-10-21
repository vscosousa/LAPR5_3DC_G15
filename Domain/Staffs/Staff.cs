using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Specializations;
using System.Linq;

namespace DDDSample1.Domain.Staffs
{
    public class Staff : Entity<StaffId>, IAggregateRoot
    {
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string FullName { get; private set; }
        public string LicenseNumber { get; private set; }
        public string Email { get; private set; }
        public string PhoneNumber { get; private set; }
        public DateTime[] AvailabilitySlots { get; private set; }
        public bool IsActive { get; private set; }

        // Foreign key property
        public SpecializationId SpecializationId { get; private set; }

        // Navigation property
        [JsonIgnore]
        public Specialization Specialization { get; private set; }

        public Staff() { }
        
        public Staff(string firstName, string lastName, string fullName, string licenseNumber, string email, string phoneNumber, SpecializationId specializationId)
        {
            if (!NameStartsWithCapital(firstName) || !NameStartsWithCapital(lastName) || !NameStartsWithCapital(fullName))
                throw new BusinessRuleValidationException("Names must start with a capital letter.");

            if (!Regex.IsMatch(email, @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"))
                throw new ArgumentException("Email must be in a valid format.");

            if (!phoneNumber.StartsWith("+") || !phoneNumber.Substring(1).All(char.IsDigit))
                throw new ArgumentException("Phone number must start with an identifier and contain only digits.");
            
            Id = new StaffId(Guid.NewGuid());
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            LicenseNumber = licenseNumber;
            Email = email;
            PhoneNumber = phoneNumber;
            AvailabilitySlots = [];
            SpecializationId = specializationId; 
            IsActive = true;
        }
        // Method to set the navigation property after creation
        public void SetSpecialization(Specialization specialization)
        {
           Specialization = specialization;
        }

        private bool NameStartsWithCapital(string fullName)
        {
            if (!char.IsUpper(fullName[0]))
                return false;

            string[] names = fullName.Split(' ');
            foreach (string name in names)
            {
                if (!char.IsUpper(name[0]))
                    return false;
            }
            return true;
        }

    }
}
