using System;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class Date : IValueObject
    {
        public string DateValue { get; }

        private Date() { }

        public Date(string date)
        {
            ArgumentNullException.ThrowIfNull(date);

            if (!Regex.IsMatch(date, @"^[0-9]{4}/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$"))
                throw new ArgumentException("Date is invalid. The correct format is YYYY/MM/DD.");

            DateValue = date;
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