using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

public class Role : IValueObject
{
    public Roles Roles { get; }

    private Role() { }

    public Role(string value)
    {
        if (value == null)
            throw new ArgumentNullException("Role cannot be null.");

        Roles = (Roles)Enum.Parse(typeof(Roles), value);
    }

    public static implicit operator Roles(Role role) => role.Roles;

    public static implicit operator Role(string value) => new Role(value);
    public override string ToString() => Roles.ToString();
    public static Role FromString(string value) => new Role(value);
}