using PxBunny.Result;
using WeightTracker.Core.Errors;

namespace WeightTracker.Core.Calculations.Protein;

internal sealed class ProteinCalculationService(
    CalculationContextResolver contextResolver)
    : ICalculationService<ProteinCalculationInput, ProteinResult>
{
    public async Task<Result<ProteinResult>> CalculateAsync(
        string userId,
        ProteinCalculationInput input,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(input);

        var contextResult = await contextResolver.ResolveAsync(
            userId,
            needsProfile: !input.Goal.HasValue,
            needsWeight: !input.WeightKg.HasValue,
            ct);

        if (!contextResult.TryGet(out var context))
            return contextResult.Error!;

        var weightKg = input.WeightKg ?? context.LatestWeightKg;
        var goal = input.Goal ?? context.Profile.ProteinGoal;
        var errors = new Dictionary<string, string[]>();

        CalculationValidation.AddMissing(
            errors,
            "weightKg",
            weightKg,
            "Weight must be provided in the request or added to weight history.");
        CalculationValidation.AddMissing(
            errors,
            "goal",
            goal,
            "Protein goal must be provided in the request or configured in the user profile.");

        return errors.Count > 0
            ? new ValidationError("Missing calculation inputs.", errors)
            : ProteinCalculator.Calculate(weightKg!.Value, goal!.Value);
    }
}
