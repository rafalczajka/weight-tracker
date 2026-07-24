using WeightTracker.Core.Calculations.Bmi;

namespace WeightTracker.Api.Endpoints.Calculations.Bmi;

internal sealed record BmiPostResponse(
    decimal Bmi,
    BmiCategory Category,
    string Classification,
    IEnumerable<BmiRangeResponse> Ranges);

internal sealed record BmiRangeResponse(
    BmiCategory Category,
    decimal? MinimumInclusive,
    decimal? MaximumExclusive);
