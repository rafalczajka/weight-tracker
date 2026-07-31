using FluentValidation;

namespace WeightTracker.Api.Endpoints.Calculations.Protein;

internal sealed record ProteinPostRequest(
    decimal? WeightKg,
    ProteinGoal? Goal);

internal sealed class ProteinPostRequestValidator : Validator<ProteinPostRequest>
{
    public ProteinPostRequestValidator()
    {
        RuleFor(request => request.WeightKg)
            .GreaterThan(0)
            .WithMessage("Weight must be greater than 0 kg.")
            .LessThanOrEqualTo(500)
            .WithMessage("Weight must not exceed 500 kg.");

        RuleFor(request => request.Goal)
            .Must(value => !value.HasValue || Enum.IsDefined(value.Value))
            .WithMessage("Protein goal is invalid.");
    }
}
