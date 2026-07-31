namespace WeightTracker.Api.Endpoints.User;

internal sealed record UserResponse(
    decimal? HeightCm,
    Sex? Sex,
    string? DateOfBirth,
    ActivityLevel? ActivityLevel,
    ProteinGoal? ProteinGoal);
