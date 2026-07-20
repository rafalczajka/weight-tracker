using FluentValidation;

namespace WeightTracker.Api.Endpoints.Weights.Delete;

internal sealed record WeightsDeleteRequest(string Date);

internal sealed class WeightsDeleteRequestValidator : Validator<WeightsDeleteRequest>
{
    public WeightsDeleteRequestValidator()
    {
        RuleFor(r => r.Date)
            .NotEmpty()
            .Must(date => date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");
    }
}
