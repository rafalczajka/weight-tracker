using WeightTracker.Core.Calculations.Bmi;

namespace WeightTracker.Api.Endpoints.Calculations.Bmi;

internal static class BmiPostMappings
{
    private const string AdultClassification = "adult";

    public static BmiPostResponse ToResponse(this BmiResult result) => new(
        Bmi: result.Value,
        Category: result.Category,
        Classification: AdultClassification,
        Ranges: BmiCalculator.AdultRanges);
}
