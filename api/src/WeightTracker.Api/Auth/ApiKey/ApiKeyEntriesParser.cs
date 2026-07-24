using System.Linq;
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
        var configuredEntries = options.Keys.ToArray();

        if (configuredEntries.Length > 0)
        {
            if (!string.IsNullOrWhiteSpace(options.KeysJson))
            {
                throw new InvalidOperationException(
                    $"Configure either {ApiKeyOptions.SectionName}:{nameof(ApiKeyOptions.Keys)} " +
                    $"or {ApiKeyOptions.SectionName}:{nameof(ApiKeyOptions.KeysJson)}, not both.");
            }

            EnsureNoNullEntries(configuredEntries, nameof(ApiKeyOptions.Keys));
            return configuredEntries;
        }

        if (string.IsNullOrWhiteSpace(options.KeysJson))
            return [];

        var entries = JsonSerializer.Deserialize<ApiKeyEntry?[]>(options.KeysJson, JsonOptions)
            ?? throw new JsonException(
                $"{ApiKeyOptions.SectionName}:{nameof(ApiKeyOptions.KeysJson)} must contain a JSON array.");

        EnsureNoNullEntries(entries, nameof(ApiKeyOptions.KeysJson));
        return entries!;
    }

    private static void EnsureNoNullEntries(ApiKeyEntry?[] entries, string sourceName)
    {
        for (var index = 0; index < entries.Length; index++)
        {
            if (entries[index] is null)
            {
                throw new InvalidOperationException(
                    $"{ApiKeyOptions.SectionName}:{sourceName}[{index}] must contain an API key object.");
            }
        }
    }
}
