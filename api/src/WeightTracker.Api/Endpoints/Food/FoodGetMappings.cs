using WeightTracker.Core.Food;

namespace WeightTracker.Api.Endpoints.Food;

internal static class FoodGetMappings
{
    public static FoodGetResponse ToResponse(this Product product) => new(
        Code: product.Code,
        Name: product.Name,
        Quantity: product.Quantity,
        ServingSize: product.ServingSize,
        ImageUrl: product.ImageUrl,
        Ingredients: product.Ingredients,
        Nutrition: product.Nutrition?.ToResponse());

    private static FoodNutritionResponse ToResponse(this Nutrition nutrition) => new(
        Per100: nutrition.Per100?.ToResponse(),
        PerServing: nutrition.PerServing?.ToResponse());

    private static FoodNutritionFactsResponse ToResponse(this NutritionFacts nutrition) => new(
        ReferenceAmount: nutrition.ReferenceAmount,
        ReferenceUnit: nutrition.ReferenceUnit,
        EnergyKcal: nutrition.EnergyKcal,
        EnergyKj: nutrition.EnergyKj,
        FatG: nutrition.FatG,
        SaturatedFatG: nutrition.SaturatedFatG,
        CarbohydratesG: nutrition.CarbohydratesG,
        SugarsG: nutrition.SugarsG,
        AddedSugarsG: nutrition.AddedSugarsG,
        FiberG: nutrition.FiberG,
        ProteinG: nutrition.ProteinG,
        SaltG: nutrition.SaltG);
}
