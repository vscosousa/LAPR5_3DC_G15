using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class Gender : IValueObject
    {
        public GenderOptions GenderOption { get; }

        private Gender() { }

        public Gender(GenderOptions genderOption)
        {
            if (!Enum.IsDefined(typeof(GenderOptions), genderOption))
                throw new ArgumentException("Invalid gender value", nameof(genderOption));

            GenderOption = genderOption;

        }

        public override string ToString() => GenderOption.ToString();

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            Gender other = (Gender)obj;
            return GenderOption == other.GenderOption;
        }

        public override int GetHashCode() => GenderOption.GetHashCode();
    }
}