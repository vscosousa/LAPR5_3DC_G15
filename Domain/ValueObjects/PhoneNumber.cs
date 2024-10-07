using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class PhoneNumber : IValueObject
    {
        public string Number;

        private PhoneNumber() { }

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

            this.Number = number;
        }

        public override bool Equals(object obj)
        {
            var compareTo = obj as PhoneNumber;

            if (ReferenceEquals(this, compareTo)) return true;
            if (compareTo is null) return false;

            return compareTo.Number.Equals(this.Number);
        }

        public override int GetHashCode() => this.Number.GetHashCode();

        public override string ToString() => this.Number;
    }
}