namespace WeightTracker.Core.Calculations.Bmi;

public sealed record BmiRange(
    BmiCategory Category,
    decimal? MinimumBmiInclusive,
    decimal? MaximumBmiExclusive)
{
    public bool Contains(decimal bmi) =>
        (MinimumBmiInclusive is not { } minimum || bmi >= minimum)
        && (MaximumBmiExclusive is not { } maximum || bmi < maximum);
}
