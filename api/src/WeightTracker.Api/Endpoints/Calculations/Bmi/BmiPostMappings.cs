using System.Linq;
using WeightTracker.Core.Calculations.Bmi;

namespace WeightTracker.Api.Endpoints.Calculations.Bmi;

internal static class BmiPostMappings
{
    public static BmiPostResponse ToResponse(this BmiResult result) => new(
        WeightKg: result.WeightKg,
        HeightCm: result.HeightCm,
        Bmi: result.Value,
        Category: result.Category,
        CategoryName: BmiCategoryNames.Get(result.Category),
        Ranges:
        [
            .. BmiCalculator
                .GetAdultWeightRanges(result.HeightCm)
                .Select(range => new BmiRangeResponse(
                    Category: range.Category,
                    CategoryName: BmiCategoryNames.Get(range.Category),
                    MinimumBmiInclusive: range.MinimumBmiInclusive,
                    MaximumBmiExclusive: range.MaximumBmiExclusive,
                    MinimumWeightKgInclusive: range.MinimumWeightKgInclusive,
                    MaximumWeightKgExclusive: range.MaximumWeightKgExclusive))
        ]);
}
