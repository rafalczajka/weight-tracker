namespace WeightTracker.Data;

internal static class Mappings
{
    public static WeightData ToDomain(this Entity entity) => new(
        entity.PartitionKey,
        DateUtils.ParseDate(entity.Date),
        Convert.ToDecimal(entity.Weight));

    public static Entity ToEntity(this WeightData domain) => new()
    {
        Date = DateUtils.FormatDate(domain.Date),
        PartitionKey = domain.UserId,
        RowKey = DateUtils.CreateRowKey(domain.Date),
        Weight = decimal.ToDouble(domain.WeightKg)
    };
}
