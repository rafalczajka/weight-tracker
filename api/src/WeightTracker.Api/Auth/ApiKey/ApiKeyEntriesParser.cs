using System.Text.Json;

namespace WeightTracker.Api.Auth.ApiKey;

internal static class ApiKeyEntriesParser
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static IReadOnlyList<ApiKeyEntry> Parse(ApiKeyOptions options)
    {
        if (options.Keys.Length > 0)
        {
            return string.IsNullOrWhiteSpace(options.KeysJson)
                ? GetNonNullEntries(options.Keys, nameof(ApiKeyOptions.Keys))
                : throw new InvalidOperationException(
                    $"Configure either {ApiKeyOptions.SectionName}:{nameof(ApiKeyOptions.Keys)} " +
                    $"or {ApiKeyOptions.SectionName}:{nameof(ApiKeyOptions.KeysJson)}, not both.");
        }

        if (string.IsNullOrWhiteSpace(options.KeysJson))
            return [];

        var entries = JsonSerializer.Deserialize<ApiKeyEntry?[]>(options.KeysJson, JsonOptions)
            ?? throw new JsonException(
                $"{ApiKeyOptions.SectionName}:{nameof(ApiKeyOptions.KeysJson)} must contain a JSON array.");

        return GetNonNullEntries(entries, nameof(ApiKeyOptions.KeysJson));
    }

    private static ApiKeyEntry[] GetNonNullEntries(ApiKeyEntry?[] entries, string sourceName)
    {
        var result = new ApiKeyEntry[entries.Length];

        for (var index = 0; index < entries.Length; index++)
        {
            result[index] = entries[index] ?? throw new InvalidOperationException(
                $"{ApiKeyOptions.SectionName}:{sourceName}[{index}] must contain an API key object.");
        }

        return result;
    }
}
