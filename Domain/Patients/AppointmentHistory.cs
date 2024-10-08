using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
        public class AppointmentHistory : IValueObject
    {
        [JsonPropertyName("Appointment")]
        public DateTime[] Appointment { get; }
    
        private AppointmentHistory() { }
    
        [JsonConstructor]
        public AppointmentHistory(DateTime[] appointment)
        {
            Appointment = appointment;
        }
    
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