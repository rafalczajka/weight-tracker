namespace WeightTracker.Api.Endpoints.Food;

internal sealed record FoodGetResponse(
    string Code,
    string? Name,
    string? Quantity,
    string? ServingSize,
    Uri? ImageUrl,
    string? Ingredients,
    FoodNutritionResponse? Nutrition);

internal sealed record FoodNutritionResponse(
    FoodNutritionFactsResponse? Per100,
    FoodNutritionFactsResponse? PerServing);

internal sealed record FoodNutritionFactsResponse(
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
