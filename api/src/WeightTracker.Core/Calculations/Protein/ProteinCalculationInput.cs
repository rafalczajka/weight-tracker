using WeightTracker.Core.Users;

namespace WeightTracker.Core.Calculations.Protein;

public sealed record ProteinCalculationInput(
    decimal? WeightKg,
    ProteinGoal? Goal);
