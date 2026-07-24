using FluentValidation;

namespace WeightTracker.Api.Endpoints.Weights.Put;

internal sealed record WeightsPutRequest(string Date, decimal WeightKg);

internal sealed class WeightsPutRequestValidator : Validator<WeightsPutRequest>
{
    public WeightsPutRequestValidator()
    {
        RuleFor(r => r.WeightKg)
            .GreaterThan(0)
            .WithMessage("Weight must be greater than 0 kg.")
            .LessThanOrEqualTo(500)
            .WithMessage("Weight must not exceed 500 kg.");

        RuleFor(r => r.Date)
            .NotEmpty()
            .Must(date => date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");
    }
}
