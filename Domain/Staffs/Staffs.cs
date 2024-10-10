using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Domain.Staffs
{
    public class Staff : Entity<StaffId>, IAggregateRoot
    {
        private string _firstName;
        private string _lastName;
        private string _fullName;
        private string _email;
        private int _phoneNumber;
        private Specialization _specialization;
        private int _licenseNumber;
        private DateTime[] _availabilitySlots;
        private bool _isActive;

        // Constructor for EF Core
        private Staff() { }

        public Staff(string firstName, string lastName, string fullName, string email, int phoneNumber, Specialization specialization, int licenseNumber, DateTime[] availabilitySlots)
        {
            Id = new StaffId(Guid.NewGuid());
            _firstName = firstName;
            _lastName = lastName;
            _fullName = fullName;
            _email = email;
            _phoneNumber = phoneNumber;
            _specialization = specialization;
            _licenseNumber = licenseNumber;
            _availabilitySlots = availabilitySlots;
            _isActive = true;
        }

        // Public getters
        public string FirstName => _firstName;
        public string LastName => _lastName;
        public string FullName => _fullName;
        public string Email => _email;
        public int PhoneNumber => _phoneNumber;
        public Specialization Specialization => _specialization;
        public int LicenseNumber => _licenseNumber;
        public DateTime[] AvailabilitySlots => _availabilitySlots;
        public bool IsActive => _isActive;
    }
}
