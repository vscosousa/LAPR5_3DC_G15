using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Text.Json;

public class ValueObjectConverter<T> : ValueConverter<T, string> where T : class
{
    public ValueObjectConverter() : base(
        v => Serialize(v),
        v => Deserialize(v))
    {
    }

    private static string Serialize(T value)
    {
        Console.WriteLine("Serializing value object of type " + value.GetType().Name);
        return JsonSerializer.Serialize(value);
    }

    private static T Deserialize(string value)
    {
        Console.WriteLine("Deserializing " + value + " to value object of type " + typeof(T).Name);
        return JsonSerializer.Deserialize<T>(value);
    }
}