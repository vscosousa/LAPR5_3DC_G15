using System;
using System.Linq;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Domain.Staffs
{
    public class Staff : Entity<StaffId>, IAggregateRoot
    {
        private string _firstName;
        private string _lastName;
        private string _fullName;
        private string _licenseNumber;
        private string _email;
        private string _phoneNumber;
        private DateTime[] _availabilitySlots;
        private bool _isActive;
        private SpecializationId _specializationId;
        
        [JsonIgnore]
        private Specialization _specialization;

        public Staff() { }

        public Staff(string firstName, string lastName, string fullName, string email, string phoneNumber, SpecializationId specializationId)
        {
            if (!NameStartsWithCapital(firstName) || !NameStartsWithCapital(lastName) || !NameStartsWithCapital(fullName))
                throw new BusinessRuleValidationException("Names must start with a capital letter.");

            if (!Regex.IsMatch(email, @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"))
                throw new ArgumentException("Email must be in a valid format.");

            if (!phoneNumber.StartsWith("+") || !phoneNumber.Substring(1).All(char.IsDigit))
                throw new ArgumentException("Phone number must start with an identifier and contain only digits.");
            
            Id = new StaffId(Guid.NewGuid());
            _firstName = firstName;
            _lastName = lastName;
            _fullName = fullName;
            _licenseNumber = "";
            _email = email;
            _phoneNumber = phoneNumber;
            _availabilitySlots = Array.Empty<DateTime>();
            _specializationId = specializationId;
            _isActive = true;
        }

        // Public getters
        public string FirstName => _firstName;
        public string LastName => _lastName;
        public string FullName => _fullName;
        public string LicenseNumber => _licenseNumber;
        public string Email => _email;
        public string PhoneNumber => _phoneNumber;
        public DateTime[] AvailabilitySlots => _availabilitySlots;
        public bool IsActive => _isActive;
        [JsonIgnore]
        public SpecializationId SpecializationId => _specializationId;
        public Specialization Specialization => _specialization;

        internal void SetLicenseNumber(string number) => _licenseNumber = number;

        internal void SetSpecialization(Specialization specialization)=> _specialization = specialization;

        internal void ChangePhoneNumber(string phoneNumber)
        {
            if (!phoneNumber.StartsWith("+") || !phoneNumber.Substring(1).All(char.IsDigit))
                throw new ArgumentException("Phone number must start with an identifier and contain only digits.");
            _phoneNumber = phoneNumber;
        }

        internal void AddAvailabilitySlot(DateTime newSlot)
        {
            if (!DateTime.TryParseExact(newSlot.ToString("yyyy/MM/dd HH:mm:ss"), "yyyy/MM/dd HH:mm:ss", null, System.Globalization.DateTimeStyles.None, out _))
                throw new BusinessRuleValidationException("Availability slot must be in the format YYYY/MM/DD HH:mm:ss.");
        
            if (newSlot < DateTime.Now)
                throw new BusinessRuleValidationException("Availability slot must be in the future.");

            var updatedSlots = _availabilitySlots.ToList();
            updatedSlots.Add(newSlot);
            _availabilitySlots = updatedSlots.OrderBy(slot => slot).ToArray();
        }

        internal void RemoveAvailabilitySlot(DateTime remSlot)
        {
            if (!DateTime.TryParseExact(remSlot.ToString("yyyy/MM/dd HH:mm"), "yyyy/MM/dd HH:mm", null, System.Globalization.DateTimeStyles.None, out _))
                throw new BusinessRuleValidationException("Availability slot must be in the format YYYY/MM/DD HH:mm:ss.");

            if (!_availabilitySlots.Contains(remSlot))
            {
                throw new BusinessRuleValidationException("The specified old availability slot does not exist.");
            }

            _availabilitySlots = _availabilitySlots.Where(slot => slot != remSlot).ToArray();
        }


        internal void ChangeSpecializationId(SpecializationId specializationId)
        {
            if (specializationId == null)
                throw new ArgumentException("SpecializationId cannot be null.");
            _specializationId = specializationId;
        }

        public void Deactivate() {
            
            if (_isActive == false)
                    throw new BusinessRuleValidationException("Staff is already deactivated.");
            _isActive = false;
        }

        private bool NameStartsWithCapital(string fullName)
        {
            if (!char.IsUpper(fullName[0]))
                return false;

            string[] names = fullName.Split(' ');
            return names.All(name => char.IsUpper(name[0]));
        }
    }
}
