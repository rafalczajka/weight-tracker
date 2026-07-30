namespace WeightTracker.Data.Weights;

internal static class WeightMappings
{
    public static WeightData ToDomain(this WeightEntity entity) => new(
        entity.PartitionKey,
        DateUtils.ParseDate(entity.Date),
        Convert.ToDecimal(entity.Weight));

    public static WeightEntity ToEntity(this WeightData domain) => new()
    {
        Date = DateUtils.FormatDate(domain.Date),
        PartitionKey = domain.UserId,
        RowKey = DateUtils.CreateRowKey(domain.Date),
        Weight = decimal.ToDouble(domain.WeightKg)
    };
}
