using System;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class Time : IValueObject
    {
        [JsonPropertyName("TimeValue")]
        public string TimeValue { get; }

        private Time() { }

        [JsonConstructor]
        public Time(string timeValue)
        {
            ArgumentNullException.ThrowIfNull(timeValue);

            if (!Regex.IsMatch(timeValue, @"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"))
                throw new ArgumentException("Time is invalid. The correct format is HH:MM.");

            TimeValue = timeValue;
        }

        public override string ToString() => TimeValue;

        public override bool Equals(object obj)
        {
            return base.Equals(obj);
        }

        public override int GetHashCode() => TimeValue.GetHashCode();
    }
}