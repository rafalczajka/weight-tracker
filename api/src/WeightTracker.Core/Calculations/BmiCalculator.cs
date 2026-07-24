namespace WeightTracker.Core.Calculations;

public static class BmiCalculator
{
    private const decimal CentimetersPerMeter = 100;

    public static decimal Calculate(decimal weightKg, decimal heightCm)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(weightKg);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(heightCm);

        var heightMeters = heightCm / CentimetersPerMeter;
        var bmi = weightKg / (heightMeters * heightMeters);

        return Math.Round(bmi, 1, MidpointRounding.AwayFromZero);
    }
}
