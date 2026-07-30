using System.Globalization;
using FluentValidation;

namespace WeightTracker.Api.Endpoints.Calories.Get;

internal sealed record CaloriesGetRequest(
    string? From,
    string? To,
    int? LimitDays);

internal sealed class CaloriesGetRequestValidator : Validator<CaloriesGetRequest>
{
    public CaloriesGetRequestValidator()
    {
        RuleFor(request => request.From)
            .Must(date => string.IsNullOrWhiteSpace(date) || date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");

        RuleFor(request => request.To)
            .Must(date => string.IsNullOrWhiteSpace(date) || date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");

        RuleFor(request => request.LimitDays)
            .GreaterThan(0)
            .WithMessage("Limit days must be greater than 0.");

        RuleFor(request => request)
            .Must(HaveValidDateRange)
            .WithMessage("Date from must be before or equal to date to.");
    }

    private static bool HaveValidDateRange(CaloriesGetRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.From) ||
            string.IsNullOrWhiteSpace(request.To) ||
            !request.From.IsValidDomainDateFormat() ||
            !request.To.IsValidDomainDateFormat())
        {
            return true;
        }

        var from = DateOnly.Parse(request.From, CultureInfo.InvariantCulture);
        var to = DateOnly.Parse(request.To, CultureInfo.InvariantCulture);

        return from <= to;
    }
}
