using FluentValidation;

namespace WeightTracker.Api.Endpoints.Calories.Put;

internal sealed record CaloriesPutRequest(
    string Id,
    int CaloriesKcal,
    string? Description);

internal sealed class CaloriesPutRequestValidator : Validator<CaloriesPutRequest>
{
    public CaloriesPutRequestValidator()
    {
        RuleFor(request => request.Id)
            .NotEmpty()
            .WithMessage("Calorie entry identifier is required.");

        RuleFor(request => request.CaloriesKcal)
            .GreaterThan(0)
            .WithMessage("Calories must be greater than 0 kcal.");

        RuleFor(request => request.Description)
            .MaximumLength(200)
            .WithMessage("Description must not exceed 200 characters.");
    }
}
