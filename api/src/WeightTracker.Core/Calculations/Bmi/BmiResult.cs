namespace WeightTracker.Core.Calculations.Bmi;

public sealed record BmiResult(
    decimal Value,
    BmiCategory Category,
    decimal WeightKg,
    decimal HeightCm);
