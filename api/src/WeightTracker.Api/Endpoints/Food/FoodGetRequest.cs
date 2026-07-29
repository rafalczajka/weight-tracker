using FluentValidation;

namespace WeightTracker.Api.Endpoints.Food;

internal sealed record FoodGetRequest(string Code);

internal sealed class FoodGetRequestValidator : Validator<FoodGetRequest>
{
    public FoodGetRequestValidator()
    {
        RuleFor(request => request.Code)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Product code is required.")
            .Matches("^[0-9]+$")
            .WithMessage("Product code must contain digits only.");
    }
}
