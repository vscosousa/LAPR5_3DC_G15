using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.ValueObjects;

namespace DDDSample1.Domain.Patients
{
    public class ContactInformation : IValueObject
    {
        public Email Email { get; private set; }
        public PhoneNumber PhoneNumber { get; private set; }

        private ContactInformation() { }

        public ContactInformation(Email email, PhoneNumber phoneNumber)
        {
            Email = email ?? throw new ArgumentNullException(nameof(email));
            PhoneNumber = phoneNumber ?? throw new ArgumentNullException(nameof(phoneNumber));
        }

        /* public override string ToString()
        {
            return Email.ToString() + " " + PhoneNumber.ToString();
        }

        public override bool Equals(object obj)
        {
            var other = (ContactInformation)obj;

            return Email.Equals(other.Email) && PhoneNumber.Equals(other.PhoneNumber);
        }

        public override int GetHashCode() => HashCode.Combine(Email, PhoneNumber); */
    }
}