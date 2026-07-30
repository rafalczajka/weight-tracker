using FluentValidation;

namespace WeightTracker.Api.Endpoints.Calories.GetByDate;

internal sealed record CaloriesGetByDateRequest(string Date);

internal sealed class CaloriesGetByDateRequestValidator : Validator<CaloriesGetByDateRequest>
{
    public CaloriesGetByDateRequestValidator()
    {
        RuleFor(request => request.Date)
            .NotEmpty()
            .Must(date => date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");
    }
}
