using Azure;
using Azure.Data.Tables.Models;
using PxBunny.Result;

namespace WeightTracker.Data;

internal sealed class WeightService(TableServiceClient tableServiceClient) : IWeightService
{
    private const string TableName = "WeightData";

    public async Task<Result> AddAsync(WeightData weightData, CancellationToken ct)
    {
        var tableClient = await GetTableClientAsync(ct);
        var entity = weightData.ToEntity();

        try
        {
            await tableClient.AddEntityAsync(entity, ct);
            return Result.Success();
        }
        catch (RequestFailedException exception) when (HasErrorCode(exception, TableErrorCode.EntityAlreadyExists))
        {
            return ResultErrors.ConflictError($"Weight entry for {weightData.Date:yyyy-MM-dd} already exists.");
        }
    }

    public async Task<Result<WeightDataGroup>> GetAsync(
        WeightDataFilter weightDataFilter,
        CancellationToken ct)
    {
        var tableClient = await GetTableClientAsync(ct);
        var (userId, dateFrom, dateTo) = weightDataFilter;

        var from = (dateFrom ?? DateOnly.MinValue).ToDomainDateString();
        var to = (dateTo ?? DateOnly.MaxValue).ToDomainDateString();

        var filter = TableClient.CreateQueryFilter($"PartitionKey eq {userId} and RowKey ge {from} and RowKey le {to}");
        var result = tableClient.Query<Entity>(filter, cancellationToken: ct).ToList();

        var data = result.Select(e => e.ToDomain()).ToList();
        return WeightDataGroup.Create(userId, data);
    }

    public async Task<Result> UpdateAsync(WeightData weightData, CancellationToken ct)
    {
        var tableClient = await GetTableClientAsync(ct);
        var entity = weightData.ToEntity();
        entity.ETag = ETag.All;

        try
        {
            await tableClient.UpdateEntityAsync(
                entity,
                entity.ETag,
                TableUpdateMode.Replace,
                ct);
            return Result.Success();
        }
        catch (RequestFailedException exception) when (HasErrorCode(exception, TableErrorCode.EntityNotFound))
        {
            return ResultErrors.NotFoundError($"Weight entry for {weightData.Date:yyyy-MM-dd} was not found.");
        }
    }

    public async Task<Result> DeleteAsync(string userId, DateOnly date, CancellationToken ct)
    {
        var tableClient = await GetTableClientAsync(ct);

        try
        {
            await tableClient.DeleteEntityAsync(
                userId,
                date.ToDomainDateString(),
                cancellationToken: ct);
            return Result.Success();
        }
        catch (RequestFailedException exception) when (HasErrorCode(exception, TableErrorCode.EntityNotFound))
        {
            return ResultErrors.NotFoundError($"Weight entry for {date:yyyy-MM-dd} was not found.");
        }
    }

    private async Task<TableClient> GetTableClientAsync(CancellationToken ct)
    {
        var tableClient = tableServiceClient.GetTableClient(TableName);
        await tableClient.CreateIfNotExistsAsync(ct);
        return tableClient;
    }

    private static bool HasErrorCode(RequestFailedException exception, TableErrorCode errorCode) =>
        string.Equals(exception.ErrorCode, errorCode.ToString(), StringComparison.Ordinal);
}
