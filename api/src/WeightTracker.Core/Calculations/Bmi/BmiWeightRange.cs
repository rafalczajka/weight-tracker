namespace WeightTracker.Core.Calculations.Bmi;

public sealed record BmiWeightRange(
    BmiCategory Category,
    decimal? MinimumBmiInclusive,
    decimal? MaximumBmiExclusive,
    decimal? MinimumWeightKgInclusive,
    decimal? MaximumWeightKgExclusive);
