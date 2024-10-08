using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.ValueObjects;

namespace DDDSample1.Domain.Patients
{
    public class EmergencyContact : IValueObject
    {

        [JsonPropertyName("EmergencyNumberValue")]
        public PhoneNumber EmergencyNumberValue { get; }

        private EmergencyContact() { }


        [JsonConstructor]
        public EmergencyContact(PhoneNumber emergencyNumberValue)
        {
            ArgumentNullException.ThrowIfNull(emergencyNumberValue);
            EmergencyNumberValue = emergencyNumberValue;

        }

        public override string ToString()
        {
            return EmergencyNumberValue.ToString();
        }

        public override bool Equals(object obj)
        {
            if (obj is not EmergencyContact emergencyContact) return false;

            return EmergencyNumberValue.Equals(emergencyContact.EmergencyNumberValue);
        }

        public override int GetHashCode() => EmergencyNumberValue.GetHashCode();
    }
}