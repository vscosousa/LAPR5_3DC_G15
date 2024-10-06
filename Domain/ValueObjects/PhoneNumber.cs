using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class PhoneNumber : IValueObject
    {
        public string CountryIdentifier { get; }
        public string PhoneNumberValue { get; }

        private PhoneNumber() { }

        public PhoneNumber(string countryIdentifier, string phoneNumber)
        {
            ArgumentNullException.ThrowIfNull(countryIdentifier);

            ArgumentNullException.ThrowIfNull(phoneNumber);

            if (!countryIdentifier.Contains('+'))
                throw new ArgumentException("Country identifier must start with a '+'.");

            CountryIdentifier = countryIdentifier;
            PhoneNumberValue = phoneNumber;
        }

        public override string ToString() => CountryIdentifier + PhoneNumberValue;

        public override bool Equals(object obj)
        {
            var other = (PhoneNumber)obj;

            return CountryIdentifier == other.CountryIdentifier && PhoneNumberValue == other.PhoneNumberValue;
        }

        public override int GetHashCode() => HashCode.Combine(CountryIdentifier, PhoneNumberValue);
    }
}