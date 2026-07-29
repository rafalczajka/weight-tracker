namespace WeightTracker.Core.Food;

public sealed record Nutrition(
    NutritionFacts? Per100,
    NutritionFacts? PerServing);
