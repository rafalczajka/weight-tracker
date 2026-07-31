namespace WeightTracker.Data.Users;

internal static class UserMappings
{
    public static UserProfile ToDomain(this UserEntity entity) => new(
        entity.PartitionKey,
        entity.HeightCm.HasValue ? Convert.ToDecimal(entity.HeightCm.Value) : null,
        ParseEnum<Sex>(entity.Sex),
        entity.DateOfBirth is null ? null : DateUtils.ParseDate(entity.DateOfBirth),
        ParseEnum<ActivityLevel>(entity.ActivityLevel),
        ParseEnum<ProteinGoal>(entity.ProteinGoal));

    public static UserEntity ToEntity(this UserProfile profile) => new()
    {
        ActivityLevel = profile.ActivityLevel?.ToString(),
        DateOfBirth = profile.DateOfBirth.HasValue ? DateUtils.FormatDate(profile.DateOfBirth.Value) : null,
        HeightCm = profile.HeightCm.HasValue ? decimal.ToDouble(profile.HeightCm.Value) : null,
        PartitionKey = profile.UserId,
        ProteinGoal = profile.ProteinGoal?.ToString(),
        RowKey = UserEntity.ProfileRowKey,
        Sex = profile.Sex?.ToString()
    };

    private static TEnum? ParseEnum<TEnum>(string? value) where TEnum : struct, Enum =>
        value is null ? null : Enum.Parse<TEnum>(value);
}
