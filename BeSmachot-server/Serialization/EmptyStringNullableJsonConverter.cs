using System.Text.Json;
using System.Text.Json.Serialization;

namespace BeSmachot.Server.Serialization;

public sealed class EmptyStringNullableJsonConverter<T> : JsonConverter<T?> where T : struct
{
    public override T? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null ||
            (reader.TokenType == JsonTokenType.String && string.IsNullOrWhiteSpace(reader.GetString())))
            return null;

        return JsonSerializer.Deserialize<T>(ref reader, options);
    }

    public override void Write(Utf8JsonWriter writer, T? value, JsonSerializerOptions options)
    {
        if (value.HasValue)
            JsonSerializer.Serialize(writer, value.Value, options);
        else
            writer.WriteNullValue();
    }
}
