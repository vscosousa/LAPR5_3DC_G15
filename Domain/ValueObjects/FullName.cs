using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class FullName : IValueObject
    {
        [JsonPropertyName("FullNameValue")]
        public string FullNameValue { get; }

        private FullName() { }


        [JsonConstructor]
        public FullName(string fullNameValue)
        {
            ArgumentNullException.ThrowIfNull(fullNameValue);
            FullNameValue = fullNameValue;
        }
        public override string ToString() => FullNameValue;

        public override bool Equals(object obj)
        {
            var compareTo = obj as FullName;

            if (ReferenceEquals(this, compareTo)) return true;
            if (compareTo is null) return false;

            return compareTo.FullNameValue.Equals(FullNameValue);
        }

        public override int GetHashCode() => FullNameValue.GetHashCode();
    }
}
