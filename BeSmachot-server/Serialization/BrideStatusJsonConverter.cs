using System.Text.Json;
using System.Text.Json.Serialization;
using BeSmachot.Server.Models;

namespace BeSmachot.Server.Serialization;

public class BrideStatusJsonConverter : JsonConverter<BrideStatus>
{
    public override BrideStatus Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return value switch
        {
            "מאורסת" or "Engaged" => BrideStatus.Engaged,
            "נשואה" or "Married" => BrideStatus.Married,
            _ => throw new JsonException("Status must be 'מאורסת' or 'נשואה'.")
        };
    }

    public override void Write(Utf8JsonWriter writer, BrideStatus value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value == BrideStatus.Engaged ? "מאורסת" : "נשואה");
    }
}
