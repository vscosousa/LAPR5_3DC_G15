using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class Name : IValueObject
    {
        public string NameValue { get; }

        private Name() { }

        public Name(string name)
        {
            if (name == null)
                throw new ArgumentNullException("Name cannot be null.");
            if (name[0] != char.ToUpper(name[0]))
                throw new ArgumentException("Name must start with a capital letter.");

            NameValue = name;
        }

        public override string ToString() => NameValue;

        public override bool Equals(object obj)
        {
            var other = (Name)obj;

            return NameValue == other.NameValue;
        }

        public override int GetHashCode() => NameValue.GetHashCode();
    }
}