using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class FullName : IValueObject
    {
        public List<Name> FullNameValue { get; }

        private FullName() { }


        public FullName(List<Name> fullName)
        {
            ArgumentNullException.ThrowIfNull(fullName);
            FullNameValue = fullName;

            if (fullName.Count < 2)
                throw new ArgumentException("Full Name must have at least two names.");
        }

        /* public override string ToString()
        {
            string fullName = "";
            foreach (Name name in FullNameValue)
            {
                fullName += name.NameValue + " ";
            }
            return fullName;
        }

        public override bool Equals(object obj)
        {
            var other = (FullName)obj;

            return FullNameValue == other.FullNameValue;
        }

        public override int GetHashCode() => FullNameValue.GetHashCode(); */
    }
}
