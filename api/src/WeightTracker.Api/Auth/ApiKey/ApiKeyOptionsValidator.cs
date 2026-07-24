using System.Text.Json;
using Microsoft.Extensions.Options;

namespace WeightTracker.Api.Auth.ApiKey;

internal sealed class ApiKeyOptionsValidator : IValidateOptions<ApiKeyOptions>
{
    private const int MinimumKeyLength = 32;

    public ValidateOptionsResult Validate(string? name, ApiKeyOptions options)
    {
        IReadOnlyList<ApiKeyEntry> entries;

        try
        {
            entries = ApiKeyEntriesParser.Parse(options);
        }
        catch (JsonException exception)
        {
            return ValidateOptionsResult.Fail(
                $"{ApiKeyOptions.SectionName}:{nameof(ApiKeyOptions.KeysJson)} must contain a valid JSON array. " +
                exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return ValidateOptionsResult.Fail(exception.Message);
        }

        var failures = new List<string>();
        var configuredKeys = new HashSet<string>(StringComparer.Ordinal);
        var entriesName = string.IsNullOrWhiteSpace(options.KeysJson)
            ? nameof(ApiKeyOptions.Keys)
            : nameof(ApiKeyOptions.KeysJson);

        for (var index = 0; index < entries.Count; index++)
        {
            var entry = entries[index];
            var entryName = $"{ApiKeyOptions.SectionName}:{entriesName}[{index}]";

            ValidateKey(entry.Key, entryName, configuredKeys, failures);

            if (string.IsNullOrWhiteSpace(entry.UserId))
                failures.Add($"{entryName}:{nameof(ApiKeyEntry.UserId)} is required.");
        }

        return failures.Count == 0
            ? ValidateOptionsResult.Success
            : ValidateOptionsResult.Fail(failures);
    }

    private static void ValidateKey(
        string key,
        string entryName,
        HashSet<string> configuredKeys,
        List<string> failures)
    {
        var keyName = $"{entryName}:{nameof(ApiKeyEntry.Key)}";

        if (string.IsNullOrWhiteSpace(key))
        {
            failures.Add($"{keyName} is required.");
            return;
        }

        if (key.Length < MinimumKeyLength)
            failures.Add($"{keyName} must contain at least {MinimumKeyLength} characters.");

        if (!configuredKeys.Add(key))
            failures.Add($"{keyName} must be unique.");
    }
}
