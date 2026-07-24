using Microsoft.Extensions.Configuration;

namespace WeightTracker.Api.Auth.ApiKey;

internal static class ApiKeyConfigurationExtensions
{
    public static string GetApiKeyHeaderName(this IConfigurationSection section)
    {
        var headerName = section.GetValue<string>(nameof(ApiKeyOptions.HeaderName));

        return string.IsNullOrWhiteSpace(headerName)
            ? ApiKeyOptions.DefaultHeaderName
            : headerName;
    }
}
