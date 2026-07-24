namespace WeightTracker.Core.Calculations.Bmi;

public sealed record BmiRange(
    BmiCategory Category,
    decimal? MinimumInclusive,
    decimal? MaximumExclusive)
{
    public bool Contains(decimal bmi) =>
        (MinimumInclusive is not { } minimum || bmi >= minimum)
        && (MaximumExclusive is not { } maximum || bmi < maximum);
}
