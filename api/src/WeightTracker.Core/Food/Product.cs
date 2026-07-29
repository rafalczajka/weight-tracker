namespace WeightTracker.Core.Food;

public sealed record Product(
    string Code,
    string? Name,
    string? Quantity,
    string? ServingSize,
    Uri? ImageUrl,
    string? Ingredients,
    Nutrition? Nutrition);
