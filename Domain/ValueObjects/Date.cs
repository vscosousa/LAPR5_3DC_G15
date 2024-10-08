using System;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class Date : IValueObject
    {
        [JsonPropertyName("DateValue")]
        public string DateValue { get; }

        private Date() { }

        [JsonConstructor]
        public Date(string dateValue)
        {
            ArgumentNullException.ThrowIfNull(dateValue);

            if (!Regex.IsMatch(dateValue, @"^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$"))
                throw new ArgumentException("Date is invalid. The correct format is YYYY/MM/DD.");

            DateValue = dateValue;
        }

        public override string ToString() => DateValue;

        public override bool Equals(object obj)
        {
            var other = (Date)obj;

            return DateValue == other.DateValue;
        }

        public override int GetHashCode() => DateValue.GetHashCode();
    }
}