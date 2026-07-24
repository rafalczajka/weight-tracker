using FluentValidation;

namespace WeightTracker.Api.Endpoints.Weights.Post;

internal sealed record WeightsPostRequest(decimal WeightKg, string? Date);

internal sealed class WeightsPostRequestValidator : Validator<WeightsPostRequest>
{
    public WeightsPostRequestValidator()
    {
        RuleFor(r => r.WeightKg)
            .GreaterThan(0)
            .WithMessage("Weight must be greater than 0 kg.")
            .LessThanOrEqualTo(500)
            .WithMessage("Weight must not exceed 500 kg.");

        RuleFor(r => r.Date)
            .Must(date => string.IsNullOrWhiteSpace(date) || date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");
    }
}
