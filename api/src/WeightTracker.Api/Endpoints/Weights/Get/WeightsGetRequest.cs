using System.Globalization;
using FluentValidation;

namespace WeightTracker.Api.Endpoints.Weights.Get;

internal sealed record WeightsGetRequest(string? From, string? To);

internal sealed class WeightsGetRequestValidator : Validator<WeightsGetRequest>
{
    public WeightsGetRequestValidator()
    {
        RuleFor(r => r.From)
            .Must(date => string.IsNullOrWhiteSpace(date) || date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");

        RuleFor(r => r.To)
            .Must(date => string.IsNullOrWhiteSpace(date) || date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");

        RuleFor(r => r)
            .Must(request =>
            {
                if (string.IsNullOrWhiteSpace(request.From) || string.IsNullOrWhiteSpace(request.To))
                    return true;

                if (!request.From.IsValidDomainDateFormat() || !request.To.IsValidDomainDateFormat())
                    return true;

                var from = DateOnly.Parse(request.From, CultureInfo.InvariantCulture);
                var to = DateOnly.Parse(request.To, CultureInfo.InvariantCulture);

                return from <= to;
            })
            .WithMessage("Date from must be before or equal to date to.");
    }
}
