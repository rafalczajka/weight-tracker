namespace WeightTracker.Core.Calculations;

internal static class CalculationValidation
{
    public static void AddMissing<T>(
        IDictionary<string, string[]> errors,
        string field,
        T? value,
        string message)
        where T : struct
    {
        if (!value.HasValue) errors[field] = [message];
    }
}
