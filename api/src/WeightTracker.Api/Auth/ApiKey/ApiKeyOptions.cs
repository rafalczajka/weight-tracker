namespace WeightTracker.Api.Auth.ApiKey;

internal sealed class ApiKeyOptions
{
    public const string SectionName = "ApiKeyAuth";
    public const string DefaultHeaderName = "X-API-KEY";

    public string HeaderName { get; init; } = DefaultHeaderName;

    public IEnumerable<ApiKeyEntry> Keys { get; init; } = [];

    public string? KeysJson { get; init; }
}
