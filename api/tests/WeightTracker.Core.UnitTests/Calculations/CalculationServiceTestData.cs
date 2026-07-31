using PxBunny.Result;
using WeightTracker.Core.Calculations;
using WeightTracker.Core.Errors;
using WeightTracker.Core.Users;
using WeightTracker.Core.Weights;

namespace WeightTracker.Core.UnitTests.Calculations;

internal static class CalculationServiceTestData
{
    public const string UserId = "user-id";
    public static readonly DateOnly Today = new(2026, 7, 31);

    public static CalculationContextResolver CreateResolver(
        StubUserService userService,
        StubWeightService weightService) => new(userService, weightService);

    public static TimeProvider CreateTimeProvider() =>
        new FixedTimeProvider(Today.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc));

    public static UserProfile CreateProfile(
        decimal? heightCm = null,
        Sex? sex = null,
        DateOnly? dateOfBirth = null,
        ActivityLevel? activityLevel = null,
        ProteinGoal? proteinGoal = null) => new(
        UserId,
        heightCm,
        sex,
        dateOfBirth,
        activityLevel,
        proteinGoal);

    public static T GetValue<T>(Result<T> result)
    {
        Assert.True(result.TryGet(out var value), result.Error?.Message);
        return value!;
    }

    public static ErrorBase GetError<T>(Result<T> result) =>
        result.Match(
            _ => throw new InvalidOperationException("Expected a failed result."),
            error => error);
}

internal sealed class FixedTimeProvider(DateTime utcNow) : TimeProvider
{
    public override DateTimeOffset GetUtcNow() => new(utcNow);
}

internal sealed class StubUserService : IUserService
{
    public int GetCallCount { get; private set; }

    public UserProfile Profile { get; init; } =
        UserProfile.Empty(CalculationServiceTestData.UserId);

    public Task<Result<UserProfile>> GetAsync(string userId, CancellationToken ct)
    {
        GetCallCount++;
        Result<UserProfile> result = Profile;
        return Task.FromResult(result);
    }

    public Task<Result<UserProfile>> UpsertAsync(
        UserProfile profile,
        CancellationToken ct) => throw new NotSupportedException();
}

internal sealed class StubWeightService : IWeightService
{
    public int GetLatestCallCount { get; private set; }

    public WeightData? LatestWeight { get; init; }

    public Task<Result<WeightData>> GetLatestAsync(
        string userId,
        CancellationToken ct)
    {
        GetLatestCallCount++;
        Result<WeightData> result = LatestWeight is null
            ? new NotFoundError("No weight entries were found.")
            : LatestWeight;
        return Task.FromResult(result);
    }

    public Task<Result> AddAsync(WeightData weightData, CancellationToken ct) =>
        throw new NotSupportedException();

    public Task<Result<WeightData>> GetByDateAsync(
        string userId,
        DateOnly date,
        CancellationToken ct) => throw new NotSupportedException();

    public Task<Result<WeightDataGroup>> GetAsync(
        WeightDataFilter filter,
        CancellationToken ct) => throw new NotSupportedException();

    public Task<Result> UpdateAsync(WeightData weightData, CancellationToken ct) =>
        throw new NotSupportedException();

    public Task<Result> DeleteAsync(
        string userId,
        DateOnly date,
        CancellationToken ct) => throw new NotSupportedException();
}
