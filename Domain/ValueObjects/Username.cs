using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

public class Username : IValueObject
{
    [JsonPropertyName("UsernameValue")]
    public string UsernameValue { get; }

    private Username() { }

    [JsonConstructor]
    public Username(string usernameValue)
    {
        if (string.IsNullOrWhiteSpace(usernameValue))
        {
            throw new ArgumentNullException("Username can't be empty");
        }

        UsernameValue = usernameValue;
    }

    public override string ToString()
    {
        return UsernameValue;
    }

    public override bool Equals(object obj)
    {
        var otherValue = (Username) obj;

        return UsernameValue == otherValue.UsernameValue;
    }

    public override int GetHashCode()
    {
        return UsernameValue.GetHashCode();
    }
}