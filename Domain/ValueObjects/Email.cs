using System;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{

    public class Email : IValueObject
    {
        public string EmailValue { get; }

        private Email() { }

        public Email(string email)
        {
            ArgumentNullException.ThrowIfNull(email);

            if (!Regex.IsMatch(email, @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"))
                throw new ArgumentException("Email is invalid.");

            EmailValue = email;
        }

        public override string ToString() => EmailValue;

        public override bool Equals(object obj)
        {
            var other = (Email)obj;

            return EmailValue == other.EmailValue;
        }

        public override int GetHashCode() => EmailValue.GetHashCode();
    }
}