namespace WeightTracker.Data.Calories;

internal static class CalorieMappings
{
    public static CalorieEntry ToDomain(this CalorieEntity entity) => new(
        entity.RowKey,
        entity.PartitionKey,
        DateUtils.ParseDate(entity.Date),
        entity.CaloriesKcal,
        entity.Description);

    public static CalorieEntity ToEntity(this CalorieEntry domain) => new()
    {
        CaloriesKcal = domain.CaloriesKcal,
        Date = DateUtils.FormatDate(domain.Date),
        Description = domain.Description,
        PartitionKey = domain.UserId,
        RowKey = domain.Id
    };
}
