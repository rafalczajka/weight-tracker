namespace WeightTracker.Core.Calculations.Bmi;

public sealed record BmiCalculationInput(
    decimal? WeightKg,
    decimal? HeightCm);
