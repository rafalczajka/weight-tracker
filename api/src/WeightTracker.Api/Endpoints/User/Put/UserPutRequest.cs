using FluentValidation;

namespace WeightTracker.Api.Endpoints.User.Put;

internal sealed record UserPutRequest(
    decimal? HeightCm,
    Sex? Sex,
    string? DateOfBirth,
    ActivityLevel? ActivityLevel,
    ProteinGoal? ProteinGoal);

internal sealed class UserPutRequestValidator : Validator<UserPutRequest>
{
    public UserPutRequestValidator(TimeProvider timeProvider)
    {
        RuleFor(request => request.HeightCm)
            .GreaterThan(0)
            .WithMessage("Height must be greater than 0 cm.")
            .LessThanOrEqualTo(300)
            .WithMessage("Height must not exceed 300 cm.");

        RuleFor(request => request.Sex)
            .Must(value => !value.HasValue || Enum.IsDefined(value.Value))
            .WithMessage("Sex is invalid.");

        RuleFor(request => request.DateOfBirth)
            .Cascade(CascadeMode.Stop)
            .Must(value => value is null || value.IsValidDomainDateFormat())
            .WithMessage($"Date of birth must be in {Constants.DateFormat} format.")
            .Must(value => value is null || IsSupportedAdult(value, timeProvider))
            .WithMessage(
                $"Age must be between {AgeCalculator.MinimumAdultAgeYears} and " +
                $"{AgeCalculator.MaximumAdultAgeYears} years.");

        RuleFor(request => request.ActivityLevel)
            .Must(value => !value.HasValue || Enum.IsDefined(value.Value))
            .WithMessage("Activity level is invalid.");

        RuleFor(request => request.ProteinGoal)
            .Must(value => !value.HasValue || Enum.IsDefined(value.Value))
            .WithMessage("Protein goal is invalid.");
    }

    private static bool IsSupportedAdult(string value, TimeProvider timeProvider)
    {
        var dateOfBirth = DateOnly.Parse(value, System.Globalization.CultureInfo.InvariantCulture);
        var today = DateOnly.FromDateTime(timeProvider.GetUtcNow().UtcDateTime);
        return AgeCalculator.IsAdultAgeSupported(dateOfBirth, today);
    }
}
