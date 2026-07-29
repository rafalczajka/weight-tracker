namespace WeightTracker.Api.Endpoints.Weights.Get;

internal sealed class WeightsGetResponse
{
    public WeightStats Stats { get; init; } = null!;

    public IEnumerable<WeightsEntryResponse> Data { get; init; } = [];
}
