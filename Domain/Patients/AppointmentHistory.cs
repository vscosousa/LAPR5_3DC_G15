using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class AppointmentHistory : IValueObject
    {
        public DateTime[] Appointment { get; private set; }

        private AppointmentHistory() { }

        public AppointmentHistory(DateTime[] appointment)
        {
            Appointment = appointment;
        }

        //toString, equals and getHashCode

        public override string ToString() => $"Appointment: {Appointment}";

        public override bool Equals(object obj)
        {
            var compareTo = obj as AppointmentHistory;

            if (ReferenceEquals(this, compareTo)) return true;
            if (compareTo is null) return false;

            return compareTo.Appointment == Appointment;
        }

        public override int GetHashCode() => HashCode.Combine(Appointment);

    }
}