using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WeightTracker.FoodData.ApiClient;

internal sealed record GetProductResponse(
    [property: JsonPropertyName("code")] string? Code,
    [property: JsonPropertyName("status")] string? Status,
    [property: JsonPropertyName("product")] OpenFoodFactsProduct? Product);

internal sealed record OpenFoodFactsProduct(
    [property: JsonPropertyName("code")] string? Code,
    [property: JsonPropertyName("product_name")] string? Name,
    [property: JsonPropertyName("quantity")] string? Quantity,
    [property: JsonPropertyName("serving_size")] string? ServingSize,
    [property: JsonPropertyName("serving_quantity"), JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? ServingQuantity,
    [property: JsonPropertyName("serving_quantity_unit")] string? ServingQuantityUnit,
    [property: JsonPropertyName("selected_images")] OpenFoodFactsSelectedImages? SelectedImages,
    [property: JsonPropertyName("ingredients_text")] string? Ingredients,
    [property: JsonPropertyName("nutrition")] OpenFoodFactsNutrition? Nutrition);

internal sealed record OpenFoodFactsSelectedImages(
    [property: JsonPropertyName("front")] OpenFoodFactsSelectedImage? Front);

internal sealed record OpenFoodFactsSelectedImage(
    [property: JsonPropertyName("display")] IReadOnlyDictionary<string, string>? Display);

internal sealed record OpenFoodFactsNutrition(
    [property: JsonPropertyName("aggregated_set")] OpenFoodFactsNutrientSet? AggregatedSet,
    [property: JsonPropertyName("input_sets")] IReadOnlyList<OpenFoodFactsNutrientSet>? InputSets);

internal sealed record OpenFoodFactsNutrientSet(
    [property: JsonPropertyName("source")] string? Source,
    [property: JsonPropertyName("preparation")] string? Preparation,
    [property: JsonPropertyName("per")] string? Per,
    [property: JsonPropertyName("per_quantity"), JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? PerQuantity,
    [property: JsonPropertyName("per_unit")] string? PerUnit,
    [property: JsonPropertyName("nutrients")]
    IReadOnlyDictionary<string, OpenFoodFactsNutrient>? Nutrients);

internal sealed record OpenFoodFactsNutrient(
    [property: JsonPropertyName("value"), JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? Value,
    [property: JsonPropertyName("value_computed"), JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? ComputedValue,
    [property: JsonPropertyName("source")] string? Source,
    [property: JsonPropertyName("source_per")] string? SourcePer);
