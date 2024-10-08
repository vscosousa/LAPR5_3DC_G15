using System;
using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

public class Role : IValueObject
{
    [JsonPropertyName("Roles")]
    public Roles Roles { get; }

    private Role() { }

    [JsonConstructor]
    public Role(string roles)
    {
        ArgumentNullException.ThrowIfNull(roles);

        Roles = (Roles)Enum.Parse(typeof(Roles), roles);
    }

    public static implicit operator Roles(Role role) => role.Roles;

    public static implicit operator Role(string value) => new Role(value);
    public override string ToString() => Roles.ToString();
    public static Role FromString(string value) => new Role(value);
}