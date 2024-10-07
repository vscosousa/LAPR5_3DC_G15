using System;
using DDDSample1.Domain.Shared;

public class Username : IValueObject
{
    public string Value { get; }

    private Username() { }
    public Username(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentNullException("Username can't be empty");
        }

        Value = value;
    }

    public override string ToString()
    {
        return Value;
    }

    public override bool Equals(object obj)
    {
        var otherValue = (Username) obj;

        return Value == otherValue.Value;
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }
}