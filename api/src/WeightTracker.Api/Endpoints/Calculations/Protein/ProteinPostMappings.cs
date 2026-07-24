using WeightTracker.Core.Calculations.Protein;

namespace WeightTracker.Api.Endpoints.Calculations.Protein;

internal static class ProteinPostMappings
{
    public static ProteinPostResponse ToResponse(this ProteinResult result) => new(
        result.MinimumProteinGramsPerDay,
        result.MaximumProteinGramsPerDay);
}
