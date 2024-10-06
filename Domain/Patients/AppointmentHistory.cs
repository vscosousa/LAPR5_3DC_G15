using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.ValueObjects;

namespace DDDSample1.Domain.Patients
{
    public class AppointmentHistory : IValueObject
    {
        public Date DateValue { get; }
        public Time TimeValue { get; }

        private AppointmentHistory() { }

        public AppointmentHistory(Date date, Time time)
        {
            DateValue = date;
            TimeValue = time;
        }

        /* public override string ToString() => DateValue.ToString() + " " + TimeValue.ToString();

        public override bool Equals(object obj)
        {
            var other = (AppointmentHistory)obj;

            return DateValue.Equals(other.DateValue) && TimeValue.Equals(other.TimeValue);
        }

        public override int GetHashCode() => HashCode.Combine(DateValue, TimeValue); */

    }
}