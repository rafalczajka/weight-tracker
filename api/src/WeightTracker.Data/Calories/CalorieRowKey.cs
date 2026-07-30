namespace WeightTracker.Data.Calories;

internal static class CalorieRowKey
{
    private const int DateKeyLength = 7;
    private const int IdentifierLength = 32;
    private const char Separator = '_';
    private const string IdentifierFormat = "N";
    private const char MinimumIdentifierCharacter = '0';
    private const char MaximumIdentifierCharacter = 'f';

    public static string Create(DateOnly date) =>
        Create(date, Guid.CreateVersion7());

    public static string Create(DateOnly date, Guid identifier) =>
        $"{DateUtils.CreateRowKey(date)}{Separator}{identifier.ToString(IdentifierFormat)}";

    public static string CreateLowerBound(DateOnly date) =>
        CreateBound(date, MinimumIdentifierCharacter);

    public static string CreateUpperBound(DateOnly date) =>
        CreateBound(date, MaximumIdentifierCharacter);

    public static bool TryParse(string? value, out DateOnly date)
    {
        date = default;

        return value?.Length == DateKeyLength + 1 + IdentifierLength
            && value[DateKeyLength] == Separator
            && DateUtils.TryParseRowKey(value[..DateKeyLength], out date)
            && Guid.TryParseExact(value.AsSpan((DateKeyLength + 1)..), IdentifierFormat, out _);
    }

    private static string CreateBound(DateOnly date, char identifierCharacter) =>
        $"{DateUtils.CreateRowKey(date)}{Separator}{new string(identifierCharacter, IdentifierLength)}";
}
