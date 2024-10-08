using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class Name : IValueObject
    {
        [JsonPropertyName("NameValue")]
        public string NameValue { get; }

        private Name() { }

        [JsonConstructor]
        public Name(string nameValue)
        {
            if (nameValue == null)
                throw new ArgumentNullException("Name cannot be null.");
            if (nameValue[0] != char.ToUpper(nameValue[0]))
                throw new ArgumentException("Name must start with a capital letter.");

            NameValue = nameValue;
        }

        public override string ToString() => NameValue;

        public override bool Equals(object obj)
        {
            var other = (Name)obj;

            return NameValue == other.NameValue;
        }

        public override int GetHashCode() => NameValue.GetHashCode();
    }
}