namespace WeightTracker.Api.Endpoints.Weights;

internal sealed record TodayResponse(DateOnly Date, bool HasEntry, decimal? Weight);
