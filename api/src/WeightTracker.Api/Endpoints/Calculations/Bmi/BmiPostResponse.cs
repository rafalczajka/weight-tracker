using WeightTracker.Core.Calculations.Bmi;

namespace WeightTracker.Api.Endpoints.Calculations.Bmi;

internal sealed record BmiPostResponse(
    decimal WeightKg,
    decimal HeightCm,
    decimal Bmi,
    BmiCategory Category,
    string CategoryName,
    IReadOnlyList<BmiRangeResponse> Ranges);

internal sealed record BmiRangeResponse(
    BmiCategory Category,
    string CategoryName,
    decimal? MinimumBmiInclusive,
    decimal? MaximumBmiExclusive,
    decimal? MinimumWeightKgInclusive,
    decimal? MaximumWeightKgExclusive);
