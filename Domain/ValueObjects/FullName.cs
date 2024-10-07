using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.ValueObjects
{
    public class FullName : IValueObject
    {
        public string FullNameValue { get; }

        private FullName() { }


        public FullName(string fullName)
        {
            ArgumentNullException.ThrowIfNull(fullName);
            FullNameValue = fullName;
        }

        public override string ToString() => FullNameValue;

        public override bool Equals(object obj)
        {
            var compareTo = obj as FullName;

            if (ReferenceEquals(this, compareTo)) return true;
            if (compareTo is null) return false;

            return compareTo.FullNameValue.Equals(FullNameValue);
        }

        public override int GetHashCode() => FullNameValue.GetHashCode();
    }
}
