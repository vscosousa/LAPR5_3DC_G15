using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;

public class ValueObjectConverter<T> : ValueConverter<T, string> where T : class
{
    private static readonly ILogger<ValueObjectConverter<T>> _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger<ValueObjectConverter<T>>();

    public ValueObjectConverter() : base(
        v => Serialize(v),
        v => Deserialize(v))
    {
    }

    private static string Serialize(T value)
    {
        _logger.LogInformation($"Serializing object of type {typeof(T)}: {value}");
        return JsonConvert.SerializeObject(value);
    }

    private static T Deserialize(string value)
    {
        _logger.LogInformation($"Deserializing string to type {typeof(T)}: {value}");
        return JsonConvert.DeserializeObject<T>(value);
    }
}