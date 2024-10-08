using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;
namespace DDDSample1.Domain.Patients
{
    public class MedicalRecordNumber : IValueObject
    {
        [JsonPropertyName("Number")]
        public int Number { get; }

        private MedicalRecordNumber() { }

        [JsonConstructor]
        public MedicalRecordNumber(int number)
        {
            ArgumentOutOfRangeException.ThrowIfNegative(number);
            Number = number;

        }

        public override string ToString() => Number.ToString();

        public override bool Equals(object obj)
        {
            if (obj is not MedicalRecordNumber medicalRecordNumber) return false;

            return Number == medicalRecordNumber.Number;
        }

        public override int GetHashCode() => Number.GetHashCode();


    }
}