using System;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{

        public class Email : IValueObject
    {
        [JsonPropertyName("EmailValue")]
        public string EmailValue { get; }
    
        private Email() { }
    
        [JsonConstructor]
        public Email(string emailValue)
        {
            ArgumentNullException.ThrowIfNull(emailValue);
    
            if (!Regex.IsMatch(emailValue, @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"))
                throw new ArgumentException("Email is invalid.");
    
            EmailValue = emailValue;
        }
    
        public override string ToString() => EmailValue;
    
        public override bool Equals(object obj)
        {
            if (obj is Email other)
            {
                return EmailValue == other.EmailValue;
            }
            return false;
        }
    
        public override int GetHashCode() => EmailValue.GetHashCode();
    }
}