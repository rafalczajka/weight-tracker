using FluentValidation;

namespace WeightTracker.Api.Endpoints.Calculations.Bmi;

internal sealed record BmiPostRequest(decimal WeightKg, decimal HeightCm);

internal sealed class BmiPostRequestValidator : Validator<BmiPostRequest>
{
    public BmiPostRequestValidator()
    {
        RuleFor(request => request.WeightKg)
            .GreaterThan(0)
            .WithMessage("Weight must be greater than 0 kg.")
            .LessThanOrEqualTo(500)
            .WithMessage("Weight must not exceed 500 kg.");

        RuleFor(request => request.HeightCm)
            .GreaterThan(0)
            .WithMessage("Height must be greater than 0 cm.")
            .LessThanOrEqualTo(300)
            .WithMessage("Height must not exceed 300 cm.");
    }
}
