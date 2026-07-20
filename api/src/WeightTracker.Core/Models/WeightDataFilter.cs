namespace WeightTracker.Core.Models;

public sealed record WeightDataFilter(string UserId, DateOnly? DateFrom = null, DateOnly? DateTo = null);
