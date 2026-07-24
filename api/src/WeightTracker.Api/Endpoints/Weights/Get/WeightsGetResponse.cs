namespace WeightTracker.Api.Endpoints.Weights.Get;

internal sealed class WeightsGetResponse
{
    public StatsResponse Stats { get; init; } = null!;

    public IEnumerable<WeightsEntryResponse> Data { get; init; } = [];
}

internal sealed record StatsResponse(
    decimal AverageWeightKg,
    decimal MaximumWeightKg,
    decimal MinimumWeightKg);
