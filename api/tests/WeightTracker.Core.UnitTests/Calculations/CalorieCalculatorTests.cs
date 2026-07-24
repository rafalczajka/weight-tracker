using WeightTracker.Core.Calculations.Calories;

namespace WeightTracker.Core.UnitTests.Calculations;

public sealed class CalorieCalculatorTests
{
    public static TheoryData<ActivityLevel, int> ActivityLevelCases => new()
    {
        { ActivityLevel.Sedentary, 1200 },
        { ActivityLevel.LightlyActive, 1375 },
        { ActivityLevel.ModeratelyActive, 1550 },
        { ActivityLevel.VeryActive, 1725 },
        { ActivityLevel.ExtraActive, 1900 }
    };

    public static TheoryData<decimal, decimal, string> InvalidMeasurementCases => new()
    {
        { 0m, 180m, "weightKg" },
        { -1m, 180m, "weightKg" },
        { 80m, 0m, "heightCm" },
        { 80m, -1m, "heightCm" }
    };

    [Fact]
    public void Calculate_WithValidInput_ReturnsRoundedCalorieRequirement()
    {
        var result = CalorieCalculator.Calculate(
            weightKg: 60m,
            heightCm: 165m,
            ageYears: 30,
            sex: Sex.Female,
            activityLevel: ActivityLevel.LightlyActive);

        Assert.Equal(1320, result.RestingCaloriesPerDay);
        Assert.Equal(1815, result.MaintenanceCaloriesPerDay);
    }

    [Theory]
    [InlineData(18, 1840, 2208)]
    [InlineData(120, 1330, 1596)]
    public void Calculate_AtAdultAgeBoundary_ReturnsCalorieRequirement(
        int ageYears,
        int expectedRestingCalories,
        int expectedMaintenanceCalories)
    {
        var result = CalorieCalculator.Calculate(
            weightKg: 80m,
            heightCm: 180m,
            ageYears,
            Sex.Male,
            ActivityLevel.Sedentary);

        Assert.Equal(expectedRestingCalories, result.RestingCaloriesPerDay);
        Assert.Equal(expectedMaintenanceCalories, result.MaintenanceCaloriesPerDay);
    }

    [Fact]
    public void Calculate_WhenCaloriesAreHalfway_RoundsAwayFromZero()
    {
        var result = CalorieCalculator.Calculate(
            weightKg: 50.05m,
            heightCm: 100m,
            ageYears: 26,
            Sex.Male,
            ActivityLevel.Sedentary);

        Assert.Equal(1001, result.RestingCaloriesPerDay);
        Assert.Equal(1201, result.MaintenanceCaloriesPerDay);
    }

    [Theory]
    [MemberData(nameof(ActivityLevelCases))]
    public void Calculate_ForActivityLevel_AppliesExpectedMultiplier(
        ActivityLevel activityLevel,
        int expectedCalories)
    {
        var result = CalorieCalculator.Calculate(
            weightKg: 50m,
            heightCm: 100m,
            ageYears: 26,
            sex: Sex.Male,
            activityLevel);

        Assert.Equal(1000, result.RestingCaloriesPerDay);
        Assert.Equal(expectedCalories, result.MaintenanceCaloriesPerDay);
    }

    [Fact]
    public void Calculate_ForSex_AppliesExpectedAdjustment()
    {
        var maleResult = CalorieCalculator.Calculate(
            50m,
            100m,
            26,
            Sex.Male,
            ActivityLevel.Sedentary);
        var femaleResult = CalorieCalculator.Calculate(
            50m,
            100m,
            26,
            Sex.Female,
            ActivityLevel.Sedentary);

        Assert.Equal(166, maleResult.RestingCaloriesPerDay - femaleResult.RestingCaloriesPerDay);
    }

    [Theory]
    [MemberData(nameof(InvalidMeasurementCases))]
    public void Calculate_WithNonPositiveMeasurement_ThrowsArgumentOutOfRangeException(
        decimal weightKg,
        decimal heightCm,
        string expectedParameter)
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => CalorieCalculator.Calculate(
                weightKg,
                heightCm,
                30,
                Sex.Male,
                ActivityLevel.Sedentary));

        Assert.Equal(expectedParameter, exception.ParamName);
    }

    [Theory]
    [InlineData(17)]
    [InlineData(121)]
    public void Calculate_WithAgeOutsideAdultRange_ThrowsArgumentOutOfRangeException(int ageYears)
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => CalorieCalculator.Calculate(
                80m,
                180m,
                ageYears,
                Sex.Male,
                ActivityLevel.Sedentary));

        Assert.Equal("ageYears", exception.ParamName);
    }

    [Fact]
    public void Calculate_WithInvalidSex_ThrowsArgumentOutOfRangeException()
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => CalorieCalculator.Calculate(
                80m,
                180m,
                30,
                (Sex)(-1),
                ActivityLevel.Sedentary));

        Assert.Equal("sex", exception.ParamName);
    }

    [Fact]
    public void Calculate_WithInvalidActivityLevel_ThrowsArgumentOutOfRangeException()
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => CalorieCalculator.Calculate(
                80m,
                180m,
                30,
                Sex.Male,
                (ActivityLevel)(-1)));

        Assert.Equal("activityLevel", exception.ParamName);
    }
}
