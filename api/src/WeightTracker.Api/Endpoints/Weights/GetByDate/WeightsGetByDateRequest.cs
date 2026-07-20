using FluentValidation;

namespace WeightTracker.Api.Endpoints.Weights.GetByDate;

internal sealed record WeightsGetByDateRequest(string Date);

internal sealed class WeightsGetByDateRequestValidator : Validator<WeightsGetByDateRequest>
{
    public WeightsGetByDateRequestValidator()
    {
        RuleFor(r => r.Date)
            .NotEmpty()
            .Must(date => date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");
    }
}
