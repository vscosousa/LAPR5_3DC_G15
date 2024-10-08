using DDDSample1.Domain.Shared;
using System.Text.Json.Serialization;

namespace DDDSample1.Domain.Patients
{
    public class MedicalConditions : IValueObject
    {
        [JsonPropertyName("Conditions")]
        public string Conditions { get; }

        private MedicalConditions() { }

        [JsonConstructor]
        public MedicalConditions(string conditions)
        {
            Conditions = conditions;
        }

        public override string ToString() => Conditions;

        public override bool Equals(object obj)
        {
            if (obj is not MedicalConditions medicalConditions) return false;

            return Conditions == medicalConditions.Conditions;
        }

        public override int GetHashCode() => Conditions.GetHashCode();
    }
}