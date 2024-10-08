using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class Password : IValueObject
    {
        [JsonPropertyName("PasswordValue")]
        public string PasswordValue { get; }

        private Password() { }

        [JsonConstructor]
        public Password(string passwordValue)
        {
            ArgumentNullException.ThrowIfNull(passwordValue);
            PasswordValue = passwordValue;
        }

        public override string ToString()
        {
            return PasswordValue;
        }

        public override bool Equals(object obj)
        {
            if (obj is not Password password) return false;

            return PasswordValue.Equals(password.PasswordValue);
        }

        public override int GetHashCode() => PasswordValue.GetHashCode();
    }
}