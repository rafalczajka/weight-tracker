using FluentValidation;

namespace WeightTracker.Api.Endpoints.Calories.Post;

internal sealed record CalorieEntryPostRequest(
    int CaloriesKcal,
    string? Description,
    string? Date);

internal sealed class CalorieEntryPostRequestValidator : Validator<CalorieEntryPostRequest>
{
    public CalorieEntryPostRequestValidator()
    {
        RuleFor(request => request.CaloriesKcal)
            .GreaterThan(0)
            .WithMessage("Calories must be greater than 0 kcal.");

        RuleFor(request => request.Description)
            .MaximumLength(200)
            .WithMessage("Description must not exceed 200 characters.");

        RuleFor(request => request.Date)
            .Must(date => string.IsNullOrWhiteSpace(date) || date.IsValidDomainDateFormat())
            .WithMessage("Invalid date format");
    }
}
