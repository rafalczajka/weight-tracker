using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Calculations.Bmi;

public static class BmiCalculator
{
    private const decimal CentimetersPerMeter = 100;

    public static IReadOnlyList<BmiRange> AdultRanges { get; } = Array.AsReadOnly<BmiRange>(
    [
        new(BmiCategory.Underweight, null, 18.5m),
        new(BmiCategory.HealthyWeight, 18.5m, 25m),
        new(BmiCategory.Overweight, 25m, 30m),
        new(BmiCategory.ObesityClass1, 30m, 35m),
        new(BmiCategory.ObesityClass2, 35m, 40m),
        new(BmiCategory.ObesityClass3, 40m, null)
    ]);

    public static BmiResult Calculate(decimal weightKg, decimal heightCm)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(weightKg);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(heightCm);

        var heightMeters = heightCm / CentimetersPerMeter;
        var bmi = Math.Round(
            weightKg / (heightMeters * heightMeters),
            1,
            MidpointRounding.AwayFromZero);
        var category = AdultRanges.Single(range => range.Contains(bmi)).Category;

        return new BmiResult(bmi, category, weightKg, heightCm);
    }

    public static IReadOnlyList<BmiWeightRange> GetAdultWeightRanges(decimal heightCm)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(heightCm);

        var heightMeters = heightCm / CentimetersPerMeter;

        return
        [
            .. AdultRanges.Select(range => new BmiWeightRange(
                range.Category,
                range.MinimumBmiInclusive,
                range.MaximumBmiExclusive,
                ToWeightKg(range.MinimumBmiInclusive, heightMeters),
                ToWeightKg(range.MaximumBmiExclusive, heightMeters)))
        ];
    }

    private static decimal? ToWeightKg(decimal? bmi, decimal heightMeters) => bmi * heightMeters * heightMeters;
}
