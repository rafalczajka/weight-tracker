using System.Globalization;
using WeightTracker.FoodData.ApiClient;

namespace WeightTracker.FoodData.Mappings;

internal static class ProductMappings
{
    public static Product ToDomain(this OpenFoodFactsProduct product, string fallbackCode)
    {
        var nutrition = product.Nutrition.ToDomain(
            product.ServingQuantity,
            product.ServingQuantityUnit);

        return new Product(
            Code: Clean(product.Code) ?? fallbackCode,
            Name: Clean(product.Name),
            Quantity: Clean(product.Quantity),
            ServingSize: GetServingSize(product.ServingSize, nutrition?.PerServing),
            ImageUrl: GetImageUrl(product.SelectedImages),
            Ingredients: Clean(product.Ingredients),
            Nutrition: nutrition);
    }

    private static string? GetServingSize(string? servingSize, NutritionFacts? perServing)
    {
        return Clean(servingSize)
            ?? (perServing?.ReferenceAmount is { } amount
                && perServing.ReferenceUnit is { } unit
                    ? $"{amount.ToString("0.##", CultureInfo.InvariantCulture)} {unit}"
                    : null);
    }

    private static Uri? GetImageUrl(OpenFoodFactsSelectedImages? selectedImages)
    {
        return selectedImages?.Front?.Display is not { } displayImages
            ? null
            : GetPreferredImage(displayImages);
    }

    private static Uri? GetPreferredImage(IReadOnlyDictionary<string, string> images)
    {
        var englishImage = images.TryGetValue("en", out var value)
            ? CreateUri(value)
            : null;

        return englishImage
            ?? images.Values
                .Select(CreateUri)
                .FirstOrDefault(image => image is not null);
    }

    private static Uri? CreateUri(string? value) =>
        Uri.TryCreate(Clean(value), UriKind.Absolute, out var uri) ? uri : null;

    private static string? Clean(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
