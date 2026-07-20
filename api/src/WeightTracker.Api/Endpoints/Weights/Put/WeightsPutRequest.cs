using FluentValidation;

namespace WeightTracker.Api.Endpoints.Weights.Put;

internal sealed record WeightsPutRequest(string Date, decimal Weight);

internal sealed class WeightsPutRequestValidator : Validator<WeightsPutRequest>
{
    public WeightsPutRequestValidator()
    {
        RuleFor(r => r.Weight)
            .NotEmpty()
            .GreaterThan(0)
            .LessThanOrEqualTo(500)
            .WithMessage("Dude, no way!");

        RuleFor(r => r.Date)
            .NotEmpty()
            .Must(date => date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");
    }
}
