using PxBunny.Result;
using WeightTracker.Core.Errors;
using WeightTracker.Core.Users;

namespace WeightTracker.Core.Calculations.Calories;

internal sealed class CalorieCalculationService(
    CalculationContextResolver contextResolver,
    TimeProvider timeProvider)
    : ICalculationService<CalorieCalculationInput, CalorieResult>
{
    public async Task<Result<CalorieResult>> CalculateAsync(
        string userId,
        CalorieCalculationInput input,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(input);

        var needsProfile = !input.HeightCm.HasValue ||
                           !input.AgeYears.HasValue ||
                           !input.Sex.HasValue ||
                           !input.ActivityLevel.HasValue;

        var contextResult = await contextResolver.ResolveAsync(
            userId,
            needsProfile,
            needsWeight: !input.WeightKg.HasValue,
            ct);

        if (!contextResult.TryGet(out var context))
            return contextResult.Error!;

        var weightKg = input.WeightKg ?? context.LatestWeightKg;
        var heightCm = input.HeightCm ?? context.Profile.HeightCm;
        var ageYears = input.AgeYears ?? GetProfileAge(context.Profile);
        var sex = input.Sex ?? context.Profile.Sex;
        var activityLevel = input.ActivityLevel ?? context.Profile.ActivityLevel;
        var errors = new Dictionary<string, string[]>();

        CalculationValidation.AddMissing(
            errors,
            "weightKg",
            weightKg,
            "Weight must be provided in the request or added to weight history.");
        CalculationValidation.AddMissing(
            errors,
            "heightCm",
            heightCm,
            "Height must be provided in the request or configured in the user profile.");
        CalculationValidation.AddMissing(
            errors,
            "ageYears",
            ageYears,
            "Age must be provided in the request or derived from date of birth in the user profile.");
        CalculationValidation.AddMissing(
            errors,
            "sex",
            sex,
            "Sex must be provided in the request or configured in the user profile.");
        CalculationValidation.AddMissing(
            errors,
            "activityLevel",
            activityLevel,
            "Activity level must be provided in the request or configured in the user profile.");

        return errors.Count > 0
            ? new ValidationError("Missing calculation inputs.", errors)
            : CalorieCalculator.Calculate(
                weightKg!.Value,
                heightCm!.Value,
                ageYears!.Value,
                sex!.Value,
                activityLevel!.Value);
    }

    private int? GetProfileAge(UserProfile profile)
    {
        if (!profile.DateOfBirth.HasValue)
            return null;

        var today = DateOnly.FromDateTime(timeProvider.GetUtcNow().UtcDateTime);
        return AgeCalculator.Calculate(profile.DateOfBirth.Value, today);
    }
}
