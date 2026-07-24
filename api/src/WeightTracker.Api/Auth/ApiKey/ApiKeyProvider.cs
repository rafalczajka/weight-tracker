using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AspNetCore.Authentication.ApiKey;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;

namespace WeightTracker.Api.Auth.ApiKey;

internal sealed class ApiKeyProvider(IOptionsMonitor<ApiKeyOptions> optionsMonitor) : IApiKeyProvider
{
    public Task<IApiKey?> ProvideAsync(string key)
    {
        if (string.IsNullOrEmpty(key))
            return Task.FromResult<IApiKey?>(null);

        var entries = ApiKeyEntriesParser.Parse(optionsMonitor.CurrentValue);

        foreach (var entry in entries)
        {
            if (!FixedTimeEquals(key, entry.Key))
                continue;

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, entry.UserId),
                new Claim(ClaimTypes.Name, entry.UserId),
                new Claim(ClaimConstants.Scp, AuthDefaults.RequiredScope)
            };

            return Task.FromResult<IApiKey?>(new ConfiguredApiKey(entry.Key, entry.UserId, claims));
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

    private sealed record ConfiguredApiKey(
        string Key,
        string OwnerName,
        IReadOnlyCollection<Claim> Claims) : IApiKey;
}
