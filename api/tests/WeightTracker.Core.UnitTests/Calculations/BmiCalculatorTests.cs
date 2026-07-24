using WeightTracker.Core.Calculations.Bmi;

namespace WeightTracker.Core.UnitTests.Calculations;

public sealed class BmiCalculatorTests
{
    public static TheoryData<decimal, BmiCategory> AdultCategoryCases => new()
    {
        { 18.4m, BmiCategory.Underweight },
        { 18.5m, BmiCategory.HealthyWeight },
        { 24.9m, BmiCategory.HealthyWeight },
        { 25m, BmiCategory.Overweight },
        { 29.9m, BmiCategory.Overweight },
        { 30m, BmiCategory.ObesityClass1 },
        { 34.9m, BmiCategory.ObesityClass1 },
        { 35m, BmiCategory.ObesityClass2 },
        { 39.9m, BmiCategory.ObesityClass2 },
        { 40m, BmiCategory.ObesityClass3 },
        { 50m, BmiCategory.ObesityClass3 }
    };

    public static TheoryData<decimal, decimal, string> InvalidInputCases => new()
    {
        { 0m, 180m, "weightKg" },
        { -1m, 180m, "weightKg" },
        { 80m, 0m, "heightCm" },
        { 80m, -1m, "heightCm" }
    };

    [Fact]
    public void Calculate_WithValidInput_ReturnsRoundedBmi()
    {
        var result = BmiCalculator.Calculate(weightKg: 80m, heightCm: 180m);

        Assert.Equal(24.7m, result.Value);
        Assert.Equal(BmiCategory.HealthyWeight, result.Category);
    }

    [Theory]
    [MemberData(nameof(AdultCategoryCases))]
    public void Calculate_ForAdultBmi_ReturnsExpectedCategory(
        decimal bmi,
        BmiCategory expectedCategory)
    {
        var result = BmiCalculator.Calculate(weightKg: bmi, heightCm: 100m);

        Assert.Equal(bmi, result.Value);
        Assert.Equal(expectedCategory, result.Category);
    }

    [Fact]
    public void AdultRanges_ContainsAllCategoriesAndBounds()
    {
        BmiRange[] expectedRanges =
        [
            new(BmiCategory.Underweight, null, 18.5m),
            new(BmiCategory.HealthyWeight, 18.5m, 25m),
            new(BmiCategory.Overweight, 25m, 30m),
            new(BmiCategory.ObesityClass1, 30m, 35m),
            new(BmiCategory.ObesityClass2, 35m, 40m),
            new(BmiCategory.ObesityClass3, 40m, null)
        ];

        Assert.Equal(expectedRanges, BmiCalculator.AdultRanges);
    }

    [Theory]
    [MemberData(nameof(InvalidInputCases))]
    public void Calculate_WithNonPositiveInput_ThrowsArgumentOutOfRangeException(
        decimal weightKg,
        decimal heightCm,
        string expectedParameter)
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => BmiCalculator.Calculate(weightKg, heightCm));

        Assert.Equal(expectedParameter, exception.ParamName);
    }
}
