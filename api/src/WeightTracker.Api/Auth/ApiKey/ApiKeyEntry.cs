namespace WeightTracker.Api.Auth.ApiKey;

internal sealed class ApiKeyEntry
{
    public string Key { get; init; } = string.Empty;

    public string UserId { get; init; } = string.Empty;
}
