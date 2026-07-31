namespace WeightTracker.Core.Users;

public static class AgeCalculator
{
    public const int MinimumAdultAgeYears = 18;
    public const int MaximumAdultAgeYears = 120;

    public static int Calculate(DateOnly dateOfBirth, DateOnly date)
    {
        var ageYears = date.Year - dateOfBirth.Year;

        if (dateOfBirth.AddYears(ageYears) > date)
            ageYears--;

        return ageYears;
    }

    public static bool IsAdultAgeSupported(DateOnly dateOfBirth, DateOnly date)
    {
        var ageYears = Calculate(dateOfBirth, date);
        return ageYears is >= MinimumAdultAgeYears and <= MaximumAdultAgeYears;
    }
}
