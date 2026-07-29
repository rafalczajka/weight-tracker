using WeightTracker.Core.Calculations.Bmi;

namespace WeightTracker.Api.Endpoints.Calculations.Bmi;

internal sealed record BmiPostResponse(
    decimal Bmi,
    BmiCategory Category,
    string Classification,
    IReadOnlyList<BmiRange> Ranges);
