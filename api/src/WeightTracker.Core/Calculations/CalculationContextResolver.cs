using PxBunny.Result;
using WeightTracker.Core.Errors;
using WeightTracker.Core.Users;
using WeightTracker.Core.Weights;

namespace WeightTracker.Core.Calculations;

internal sealed class CalculationContextResolver(
    IUserService userService,
    IWeightService weightService)
{
    public async Task<Result<CalculationContext>> ResolveAsync(
        string userId,
        bool needsProfile,
        bool needsWeight,
        CancellationToken ct)
    {
        var profileTask = needsProfile ? userService.GetAsync(userId, ct) : null;
        var weightTask = needsWeight ? weightService.GetLatestAsync(userId, ct) : null;

        var profile = UserProfile.Empty(userId);
        decimal? latestWeightKg = null;

        if (profileTask is not null)
        {
            var profileResult = await profileTask;

            if (!profileResult.TryGet(out profile))
                return profileResult.Error!;
        }

        if (weightTask is not null)
        {
            var weightResult = await weightTask;

            if (weightResult.TryGet(out var weight))
                latestWeightKg = weight.WeightKg;
            else if (weightResult.Error is not NotFoundError)
                return weightResult.Error!;
        }

        return new CalculationContext(profile, latestWeightKg);
    }
}

internal sealed record CalculationContext(
    UserProfile Profile,
    decimal? LatestWeightKg);
