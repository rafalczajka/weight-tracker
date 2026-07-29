namespace WeightTracker.Core.Food;

public sealed record NutritionFacts(
    decimal? ReferenceAmount,
    string? ReferenceUnit,
    decimal? EnergyKcal,
    decimal? EnergyKj,
    decimal? FatG,
    decimal? SaturatedFatG,
    decimal? CarbohydratesG,
    decimal? SugarsG,
    decimal? AddedSugarsG,
    decimal? FiberG,
    decimal? ProteinG,
    decimal? SaltG);
