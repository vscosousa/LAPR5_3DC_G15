using System;
using DDDSample1.Domain.Shared;
using Newtonsoft.Json;

namespace DDDSample1.Domain.Staffs
{
    public class LicenseNumber
    {
        public int NumberL { get; }

        private LicenseNumber() { }

        [JsonConstructor]

        public LicenseNumber(int numberL) {
            NumberL= numberL;
        }

        public override string ToString() => NumberL.ToString();

        public override bool Equals(object obj)
        {
            if (obj is not LicenseNumber numberL) return false;

            return NumberL == numberL.NumberL;
        }

        public override int GetHashCode() => NumberL.GetHashCode();

    }
}
