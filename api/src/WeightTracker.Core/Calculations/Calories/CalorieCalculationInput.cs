using WeightTracker.Core.Users;

namespace WeightTracker.Core.Calculations.Calories;

public sealed record CalorieCalculationInput(
    decimal? WeightKg,
    decimal? HeightCm,
    int? AgeYears,
    Sex? Sex,
    ActivityLevel? ActivityLevel);
