using Azure;
using Azure.Data.Tables.Models;
using System.Collections.Generic;
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

        var lowerRowKey = DateUtils.CreateRowKey(dateTo ?? DateOnly.MaxValue);
        var upperRowKey = DateUtils.CreateRowKey(dateFrom ?? DateOnly.MinValue);

        var filter = TableClient.CreateQueryFilter($"PartitionKey eq {userId} and RowKey ge {lowerRowKey} and RowKey le {upperRowKey}");
        var result = tableClient.QueryAsync<Entity>(filter, cancellationToken: ct);
        var data = new List<WeightData>();

        await foreach (var entity in result)
        {
            data.Add(entity.ToDomain());
        }

        data.Sort((left, right) => left.Date.CompareTo(right.Date));
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
                DateUtils.CreateRowKey(date),
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
