namespace WeightTracker.Core.Users;

public sealed record UserProfile(
    string UserId,
    decimal? HeightCm,
    Sex? Sex,
    DateOnly? DateOfBirth,
    ActivityLevel? ActivityLevel,
    ProteinGoal? ProteinGoal)
{
    public static UserProfile Empty(string userId) => new(
        userId,
        HeightCm: null,
        Sex: null,
        DateOfBirth: null,
        ActivityLevel: null,
        ProteinGoal: null);
}
