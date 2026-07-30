namespace WeightTracker.Core.Weights;

public sealed record WeightMovingAverageValue(
    DateOnly Date,
    decimal AverageWeightKg);
