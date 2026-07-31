using FluentValidation;

namespace WeightTracker.Api.Endpoints.Calculations.Calories;

internal sealed record CaloriesPostRequest(
    decimal? WeightKg,
    decimal? HeightCm,
    int? AgeYears,
    Sex? Sex,
    ActivityLevel? ActivityLevel);

internal sealed class CaloriesPostRequestValidator : Validator<CaloriesPostRequest>
{
    public CaloriesPostRequestValidator()
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

        RuleFor(request => request.AgeYears)
            .InclusiveBetween(18, 120)
            .WithMessage("Age must be between 18 and 120 years.");

        RuleFor(request => request.Sex)
            .Must(value => !value.HasValue || Enum.IsDefined(value.Value))
            .WithMessage("Sex is invalid.");

        RuleFor(request => request.ActivityLevel)
            .Must(value => !value.HasValue || Enum.IsDefined(value.Value))
            .WithMessage("Activity level is invalid.");
    }
}
