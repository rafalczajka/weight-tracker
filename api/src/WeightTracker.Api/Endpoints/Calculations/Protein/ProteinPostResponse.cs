namespace WeightTracker.Api.Endpoints.Calculations.Protein;

internal sealed record ProteinPostResponse(
    decimal MinimumProteinGramsPerDay,
    decimal MaximumProteinGramsPerDay);
