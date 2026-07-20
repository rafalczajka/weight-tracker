using FluentValidation;

namespace WeightTracker.Api.Endpoints.Weights.Post;

internal sealed record WeightsPostRequest(decimal Weight, string? Date);

internal sealed class WeightsPostRequestValidator : Validator<WeightsPostRequest>
{
    public WeightsPostRequestValidator()
    {
        RuleFor(r => r.Weight)
            .NotEmpty()
            .GreaterThan(0)
            .LessThanOrEqualTo(500)
            .WithMessage("Dude, no way!");

        RuleFor(r => r.Date)
            .Must(date => string.IsNullOrWhiteSpace(date) || date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");
    }
}
