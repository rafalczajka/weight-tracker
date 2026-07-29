using WeightTracker.FoodData.ApiClient;

namespace WeightTracker.FoodData.Mappings;

internal static class NutritionMappings
{
    private const string AsSold = "as_sold";
    private const string EstimatedSource = "estimate";
    private const string Per100Grams = "100g";
    private const string Per100Milliliters = "100ml";
    private const string PerServing = "serving";

    private static readonly string[] NutrientIds =
    [
        "energy-kcal",
        "energy-kj",
        "fat",
        "saturated-fat",
        "carbohydrates",
        "sugars",
        "added-sugars",
        "fiber",
        "proteins",
        "salt"
    ];

    public static Nutrition? ToDomain(
        this OpenFoodFactsNutrition? nutrition,
        decimal? servingQuantity,
        string? servingUnit)
    {
        if (nutrition is null) return null;

        var per100Set = FindBestSet(nutrition.InputSets, IsPer100);
        var perServingSet = FindBestSet(
            nutrition.InputSets,
            per => string.Equals(per, PerServing, StringComparison.OrdinalIgnoreCase));

        var per100 = ToNutritionFacts(per100Set) ?? ToNutritionFacts(nutrition.AggregatedSet);
        var suppliedPerServing = ToNutritionFacts(perServingSet);

        var perServing = ScaleToServing(
            per100,
            suppliedPerServing?.ReferenceAmount ?? servingQuantity,
            suppliedPerServing?.ReferenceUnit ?? servingUnit) ?? suppliedPerServing;

        return per100 is null && perServing is null
            ? null
            : new Nutrition(per100, perServing);
    }

    private static OpenFoodFactsNutrientSet? FindBestSet(
        IReadOnlyList<OpenFoodFactsNutrientSet>? sets,
        Func<string?, bool> matchesReference)
    {
        OpenFoodFactsNutrientSet? bestSet = null;
        var bestValueCount = 0;

        foreach (var set in sets ?? [])
        {
            if (!matchesReference(set.Per)
                || string.Equals(set.Source, EstimatedSource, StringComparison.OrdinalIgnoreCase)
                || (set.Preparation is not null
                    && !string.Equals(set.Preparation, AsSold, StringComparison.OrdinalIgnoreCase)))
            {
                continue;
            }

            var valueCount = CountNutrientValues(set);
            if (valueCount <= bestValueCount) continue;

            bestSet = set;
            bestValueCount = valueCount;
        }

        return bestSet;
    }

    private static int CountNutrientValues(OpenFoodFactsNutrientSet set) =>
        NutrientIds.Count(id => GetNutrientValue(set, id) is not null);

    private static NutritionFacts? ToNutritionFacts(OpenFoodFactsNutrientSet? set)
    {
        if (set is null || CountNutrientValues(set) == 0) return null;

        var (referenceAmount, referenceUnit) = GetReference(set);

        return new NutritionFacts(
            ReferenceAmount: referenceAmount,
            ReferenceUnit: referenceUnit,
            EnergyKcal: GetNutrientValue(set, "energy-kcal"),
            EnergyKj: GetNutrientValue(set, "energy-kj"),
            FatG: GetNutrientValue(set, "fat"),
            SaturatedFatG: GetNutrientValue(set, "saturated-fat"),
            CarbohydratesG: GetNutrientValue(set, "carbohydrates"),
            SugarsG: GetNutrientValue(set, "sugars"),
            AddedSugarsG: GetNutrientValue(set, "added-sugars"),
            FiberG: GetNutrientValue(set, "fiber"),
            ProteinG: GetNutrientValue(set, "proteins"),
            SaltG: GetNutrientValue(set, "salt"));
    }

    private static NutritionFacts? ScaleToServing(
        NutritionFacts? per100,
        decimal? servingQuantity,
        string? servingUnit)
    {
        var normalizedUnit = Clean(servingUnit);
        if (per100 is null
            || servingQuantity is not > 0
            || normalizedUnit is null
            || !string.Equals(per100.ReferenceUnit, normalizedUnit, StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var factor = servingQuantity.Value / 100m;

        return new NutritionFacts(
            ReferenceAmount: servingQuantity,
            ReferenceUnit: normalizedUnit,
            EnergyKcal: Scale(per100.EnergyKcal, factor),
            EnergyKj: Scale(per100.EnergyKj, factor),
            FatG: Scale(per100.FatG, factor),
            SaturatedFatG: Scale(per100.SaturatedFatG, factor),
            CarbohydratesG: Scale(per100.CarbohydratesG, factor),
            SugarsG: Scale(per100.SugarsG, factor),
            AddedSugarsG: Scale(per100.AddedSugarsG, factor),
            FiberG: Scale(per100.FiberG, factor),
            ProteinG: Scale(per100.ProteinG, factor),
            SaltG: Scale(per100.SaltG, factor));
    }

    private static decimal? GetNutrientValue(OpenFoodFactsNutrientSet set, string nutrientId)
    {
        return set.Nutrients is not null
            && set.Nutrients.TryGetValue(nutrientId, out var nutrient)
            && !string.Equals(nutrient.Source, EstimatedSource, StringComparison.OrdinalIgnoreCase)
                ? nutrient.Value ?? nutrient.ComputedValue
                : null;
    }

    private static (decimal? Amount, string? Unit) GetReference(OpenFoodFactsNutrientSet set)
    {
        var reference = GetNutrientReference(set) ?? set.Per;
        return string.Equals(reference, Per100Grams, StringComparison.OrdinalIgnoreCase)
            ? (100m, "g")
            : string.Equals(reference, Per100Milliliters, StringComparison.OrdinalIgnoreCase)
                ? (100m, "ml")
                : (set.PerQuantity, Clean(set.PerUnit));
    }

    private static string? GetNutrientReference(OpenFoodFactsNutrientSet set)
    {
        if (set.Nutrients is null) return null;

        foreach (var nutrientId in NutrientIds)
        {
            if (set.Nutrients.TryGetValue(nutrientId, out var nutrient)
                && !string.Equals(nutrient.Source, EstimatedSource, StringComparison.OrdinalIgnoreCase)
                && IsPer100(nutrient.SourcePer))
            {
                return nutrient.SourcePer;
            }
        }

        return null;
    }

    private static bool IsPer100(string? value) =>
        string.Equals(value, Per100Grams, StringComparison.OrdinalIgnoreCase)
        || string.Equals(value, Per100Milliliters, StringComparison.OrdinalIgnoreCase);

    private static decimal? Scale(decimal? value, decimal factor) => value * factor;

    private static string? Clean(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
