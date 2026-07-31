using PxBunny.Result;
using WeightTracker.Core.Errors;

namespace WeightTracker.Core.Calculations.Bmi;

internal sealed class BmiCalculationService(
    CalculationContextResolver contextResolver)
    : ICalculationService<BmiCalculationInput, BmiResult>
{
    public async Task<Result<BmiResult>> CalculateAsync(
        string userId,
        BmiCalculationInput input,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(input);

        var contextResult = await contextResolver.ResolveAsync(
            userId,
            needsProfile: !input.HeightCm.HasValue,
            needsWeight: !input.WeightKg.HasValue,
            ct);

        if (!contextResult.TryGet(out var context))
            return contextResult.Error!;

        var weightKg = input.WeightKg ?? context.LatestWeightKg;
        var heightCm = input.HeightCm ?? context.Profile.HeightCm;
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

        return errors.Count > 0
            ? new ValidationError("Missing calculation inputs.", errors)
            : BmiCalculator.Calculate(weightKg!.Value, heightCm!.Value);
    }
}
