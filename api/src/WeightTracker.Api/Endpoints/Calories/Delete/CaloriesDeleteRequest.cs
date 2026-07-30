using FluentValidation;

namespace WeightTracker.Api.Endpoints.Calories.Delete;

internal sealed record CaloriesDeleteRequest(string Id);

internal sealed class CaloriesDeleteRequestValidator : Validator<CaloriesDeleteRequest>
{
    public CaloriesDeleteRequestValidator()
    {
        RuleFor(request => request.Id)
            .NotEmpty()
            .WithMessage("Calorie entry identifier is required.");
    }
}
