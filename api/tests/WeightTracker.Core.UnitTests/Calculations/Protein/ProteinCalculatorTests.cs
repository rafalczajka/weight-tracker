using WeightTracker.Core.Calculations.Protein;
using WeightTracker.Core.Users;

namespace WeightTracker.Core.UnitTests.Calculations.Protein;

public sealed class ProteinCalculatorTests
{
    [Theory]
    [InlineData(80, 66.4, 96)]
    public void Calculate_ForGeneralHealth_ReturnsRecommendedRange(
        decimal weightKg,
        decimal expectedMinimumProteinGramsPerDay,
        decimal expectedMaximumProteinGramsPerDay)
    {
        var result = ProteinCalculator.Calculate(weightKg, ProteinGoal.GeneralHealth);

        Assert.Equal(expectedMinimumProteinGramsPerDay, result.MinimumProteinGramsPerDay);
        Assert.Equal(expectedMaximumProteinGramsPerDay, result.MaximumProteinGramsPerDay);
    }

    [Fact]
    public void Calculate_WhenProteinIsHalfway_RoundsAwayFromZero()
    {
        var result = ProteinCalculator.Calculate(75m, ProteinGoal.GeneralHealth);

        Assert.Equal(62.3m, result.MinimumProteinGramsPerDay);
        Assert.Equal(90m, result.MaximumProteinGramsPerDay);
    }

    [Theory]
    [InlineData(80, 112, 160)]
    [InlineData(75, 105, 150)]
    public void Calculate_ForMuscleGain_ReturnsRecommendedRange(
        decimal weightKg,
        decimal expectedMinimumProteinGramsPerDay,
        decimal expectedMaximumProteinGramsPerDay)
    {
        var result = ProteinCalculator.Calculate(weightKg, ProteinGoal.MuscleGain);

        Assert.Equal(expectedMinimumProteinGramsPerDay, result.MinimumProteinGramsPerDay);
        Assert.Equal(expectedMaximumProteinGramsPerDay, result.MaximumProteinGramsPerDay);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Calculate_WithNonPositiveWeight_ThrowsArgumentOutOfRangeException(decimal weightKg)
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => ProteinCalculator.Calculate(weightKg, ProteinGoal.GeneralHealth));

        Assert.Equal("weightKg", exception.ParamName);
    }

    [Fact]
    public void Calculate_WithInvalidGoal_ThrowsArgumentOutOfRangeException()
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => ProteinCalculator.Calculate(80m, (ProteinGoal)(-1)));

        Assert.Equal("goal", exception.ParamName);
    }
}
