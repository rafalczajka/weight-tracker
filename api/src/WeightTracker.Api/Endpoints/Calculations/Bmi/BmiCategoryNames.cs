using WeightTracker.Core.Calculations.Bmi;

namespace WeightTracker.Api.Endpoints.Calculations.Bmi;

internal static class BmiCategoryNames
{
    public static string Get(BmiCategory category) => category switch
    {
        BmiCategory.Underweight => "Underweight",
        BmiCategory.HealthyWeight => "Healthy weight",
        BmiCategory.Overweight => "Overweight",
        BmiCategory.ObesityClass1 => "Obesity class I",
        BmiCategory.ObesityClass2 => "Obesity class II",
        BmiCategory.ObesityClass3 => "Obesity class III",
        _ => throw new ArgumentOutOfRangeException(nameof(category), category, null)
    };
}
