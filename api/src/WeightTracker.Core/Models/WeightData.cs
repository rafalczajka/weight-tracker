namespace WeightTracker.Core.Models;

public sealed record WeightData(string UserId, DateOnly Date, decimal Weight);
