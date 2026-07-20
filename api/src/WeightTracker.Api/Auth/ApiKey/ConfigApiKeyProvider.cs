using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using AspNetCore.Authentication.ApiKey;
using Microsoft.Extensions.Options;

namespace WeightTracker.Api.Auth.ApiKey;

internal sealed class ConfigApiKeyProvider(IOptionsMonitor<ApiKeyOptions> optionsMonitor) : IApiKeyProvider
{
    private static readonly JsonSerializerOptions KeysJsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public Task<IApiKey?> ProvideAsync(string key)
    {
        if (string.IsNullOrEmpty(key))
            return Task.FromResult<IApiKey?>(null);

        var options = optionsMonitor.CurrentValue;
        var entries = options.Keys.ToList();

        if (entries.Count == 0 && !string.IsNullOrWhiteSpace(options.KeysJson))
            entries = DeserializeKeys(options.KeysJson) ?? [];

        if (entries.Count == 0)
            return Task.FromResult<IApiKey?>(null);

        foreach (var entry in entries)
        {
            if (string.IsNullOrEmpty(entry.Key) ||
                string.IsNullOrEmpty(entry.UserId) ||
                !FixedTimeEquals(key, entry.Key))
            {
                continue;
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, entry.UserId),
                new Claim(ClaimTypes.Name, entry.UserId)
            };

            return Task.FromResult<IApiKey?>(new ConfiguredApiKey(key, entry.UserId, claims));
        }

        return Task.FromResult<IApiKey?>(null);
    }

    private static bool FixedTimeEquals(string left, string right)
    {
        var leftBytes = Encoding.UTF8.GetBytes(left);
        var rightBytes = Encoding.UTF8.GetBytes(right);

        return leftBytes.Length == rightBytes.Length
            && CryptographicOperations.FixedTimeEquals(leftBytes, rightBytes);
    }

    private static List<ApiKeyEntry>? DeserializeKeys(string keysJson)
    {
        try
        {
            return JsonSerializer.Deserialize<List<ApiKeyEntry>>(keysJson, KeysJsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }
    }
}

internal sealed record ConfiguredApiKey(string Key, string OwnerName, IReadOnlyCollection<Claim> Claims) : IApiKey;
