namespace WeightTracker.Core.Weights;

public sealed record WeightDataFilter(
    string UserId,
    DateOnly? DateFrom = null,
    DateOnly? DateTo = null,
    int? Limit = null);
