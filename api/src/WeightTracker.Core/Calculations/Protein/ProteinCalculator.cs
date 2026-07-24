namespace WeightTracker.Core.Calculations.Protein;

public static class ProteinCalculator
{
    private const decimal GeneralHealthMinimumProteinGramsPerKg = 0.83m;
    private const decimal GeneralHealthMaximumProteinGramsPerKg = 1.2m;
    private const decimal MuscleGainMinimumProteinGramsPerKg = 1.4m;
    private const decimal MuscleGainMaximumProteinGramsPerKg = 2m;

    public static ProteinResult Calculate(decimal weightKg, ProteinGoal goal)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(weightKg);

        var (minimumProteinGramsPerKg, maximumProteinGramsPerKg) = goal switch
        {
            ProteinGoal.GeneralHealth => (
                GeneralHealthMinimumProteinGramsPerKg,
                GeneralHealthMaximumProteinGramsPerKg),
            ProteinGoal.MuscleGain => (
                MuscleGainMinimumProteinGramsPerKg,
                MuscleGainMaximumProteinGramsPerKg),
            _ => throw new ArgumentOutOfRangeException(nameof(goal), goal, null)
        };

        return new ProteinResult(
            MinimumProteinGramsPerDay: CalculateProteinGrams(weightKg, minimumProteinGramsPerKg),
            MaximumProteinGramsPerDay: CalculateProteinGrams(weightKg, maximumProteinGramsPerKg));
    }

    private static decimal CalculateProteinGrams(decimal weightKg, decimal proteinGramsPerKg) =>
        Math.Round(
            weightKg * proteinGramsPerKg,
            1,
            MidpointRounding.AwayFromZero);
}
