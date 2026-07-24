namespace WeightTracker.Core.Calculations.Calories;

public static class CalorieCalculator
{
    private const int MinimumAdultAgeYears = 18;
    private const int MaximumAdultAgeYears = 120;

    public static CalorieResult Calculate(
        decimal weightKg,
        decimal heightCm,
        int ageYears,
        Sex sex,
        ActivityLevel activityLevel)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(weightKg);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(heightCm);
        ArgumentOutOfRangeException.ThrowIfLessThan(ageYears, MinimumAdultAgeYears);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(ageYears, MaximumAdultAgeYears);

        var sexAdjustment = GetSexAdjustment(sex);
        var activityMultiplier = GetActivityMultiplier(activityLevel);
        var restingCalories = (10m * weightKg)
            + (6.25m * heightCm)
            - (5m * ageYears)
            + sexAdjustment;
        var maintenanceCalories = restingCalories * activityMultiplier;

        return new CalorieResult(
            RestingCaloriesPerDay: RoundToKcal(restingCalories),
            MaintenanceCaloriesPerDay: RoundToKcal(maintenanceCalories));
    }

    private static decimal GetSexAdjustment(Sex sex) => sex switch
    {
        Sex.Female => -161m,
        Sex.Male => 5m,
        _ => throw new ArgumentOutOfRangeException(nameof(sex), sex, null)
    };

    private static decimal GetActivityMultiplier(ActivityLevel activityLevel) => activityLevel switch
    {
        ActivityLevel.Sedentary => 1.2m,
        ActivityLevel.LightlyActive => 1.375m,
        ActivityLevel.ModeratelyActive => 1.55m,
        ActivityLevel.VeryActive => 1.725m,
        ActivityLevel.ExtraActive => 1.9m,
        _ => throw new ArgumentOutOfRangeException(nameof(activityLevel), activityLevel, null)
    };

    private static int RoundToKcal(decimal value) => (int)Math.Round(value, MidpointRounding.AwayFromZero);
}
