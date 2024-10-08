using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class PhoneNumber : IValueObject
    {
        [JsonPropertyName("Number")]
        public string Number { get; private set; }

        private PhoneNumber() { }

        [JsonConstructor]
        public PhoneNumber(string number)
        {
            if (string.IsNullOrWhiteSpace(number))
            {
                throw new BusinessRuleValidationException("Phone number can't be null or empty");
            }
            if (!Regex.IsMatch(number, @"^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$"))
            {
                throw new BusinessRuleValidationException("Phone number is invalid.");
            }
            Number = number;
        }

        public override bool Equals(object obj)
        {
            var compareTo = obj as PhoneNumber;

            if (ReferenceEquals(this, compareTo)) return true;
            if (compareTo is null) return false;

            return compareTo.Number.Equals(this.Number);
        }

        public override int GetHashCode() => Number.GetHashCode();

        public override string ToString() => Number;
    }
}