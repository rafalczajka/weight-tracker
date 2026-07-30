using Azure;
using Azure.Data.Tables.Models;
using System.Collections.Generic;
using System.Linq;
using PxBunny.Result;

namespace WeightTracker.Data.Weights;

internal sealed class WeightService(TableServiceClient tableServiceClient) : IWeightService
{
    private readonly TableClient _tableClient = tableServiceClient.GetTableClient(WeightEntity.TableName);

    public async Task<Result> AddAsync(WeightData weightData, CancellationToken ct)
    {
        var entity = weightData.ToEntity();

        try
        {
            await _tableClient.AddEntityAsync(entity, ct);
            return Result.Success();
        }
        catch (RequestFailedException exception) when (HasErrorCode(exception, TableErrorCode.EntityAlreadyExists))
        {
            return ResultErrors.ConflictError($"Weight entry for {weightData.Date:yyyy-MM-dd} already exists.");
        }
    }

    public async Task<Result<WeightData>> GetByDateAsync(
        string userId,
        DateOnly date,
        CancellationToken ct)
    {
        var response = await _tableClient.GetEntityIfExistsAsync<WeightEntity>(
            userId,
            DateUtils.CreateRowKey(date),
            cancellationToken: ct);

        return response.HasValue
            ? response.Value!.ToDomain()
            : ResultErrors.NotFoundError($"Weight entry for {date:yyyy-MM-dd} was not found.");
    }

    public async Task<Result<WeightData>> GetLatestAsync(
        string userId,
        CancellationToken ct)
    {
        var filter = TableClient.CreateQueryFilter($"PartitionKey eq {userId}");
        var entities = _tableClient.QueryAsync<WeightEntity>(
            filter,
            maxPerPage: 1,
            cancellationToken: ct);

        await foreach (var entity in entities)
        {
            return entity.ToDomain();
        }

        return ResultErrors.NotFoundError("No weight entries were found.");
    }

    public async Task<Result<WeightDataGroup>> GetAsync(
        WeightDataFilter weightDataFilter,
        CancellationToken ct)
    {
        var (userId, dateFrom, dateTo, limit, movingAverageDays) = weightDataFilter;
        var data = await GetRangeAsync(userId, dateFrom, dateTo, limit, ct);
        var movingAverage = movingAverageDays.HasValue
            ? await CreateMovingAverageAsync(userId, data, movingAverageDays.Value, ct)
            : null;

        return WeightDataGroup.Create(userId, data, movingAverage);
    }

    public async Task<Result> UpdateAsync(WeightData weightData, CancellationToken ct)
    {
        var entity = weightData.ToEntity();

        try
        {
            await _tableClient.UpdateEntityAsync(
                entity,
                ETag.All,
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
        try
        {
            await _tableClient.DeleteEntityAsync(
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

    private static bool HasErrorCode(RequestFailedException exception, TableErrorCode errorCode) =>
        string.Equals(exception.ErrorCode, errorCode.ToString(), StringComparison.Ordinal);

    private async Task<List<WeightData>> GetRangeAsync(
        string userId,
        DateOnly? dateFrom,
        DateOnly? dateTo,
        int? limit,
        CancellationToken ct)
    {
        var filter = CreateRangeFilter(userId, dateFrom, dateTo);
        var entities = _tableClient.QueryAsync<WeightEntity>(
            filter,
            maxPerPage: limit,
            cancellationToken: ct);
        var data = new List<WeightData>();

        await foreach (var entity in entities)
        {
            data.Add(entity.ToDomain());

            if (limit.HasValue && data.Count >= limit.Value) break;
        }

        return data;
    }

    private async Task<WeightMovingAverage> CreateMovingAverageAsync(
        string userId,
        List<WeightData> data,
        int windowDays,
        CancellationToken ct)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(windowDays, 1);

        if (data.Count == 0 || windowDays == 1)
        {
            return WeightMovingAverage.Create(windowDays, data, []);
        }

        var oldestDate = data.Min(entry => entry.Date);

        if (oldestDate == DateOnly.MinValue)
        {
            return WeightMovingAverage.Create(windowDays, data, []);
        }

        var lookbackDays = Math.Min(windowDays - 1, oldestDate.DayNumber);
        var precedingData = await GetRangeAsync(
            userId,
            oldestDate.AddDays(-lookbackDays),
            oldestDate.AddDays(-1),
            limit: null,
            ct);

        return WeightMovingAverage.Create(windowDays, data, precedingData);
    }

    private static string CreateRangeFilter(
        string userId,
        DateOnly? dateFrom,
        DateOnly? dateTo)
    {
        var lowerRowKey = DateUtils.CreateRowKey(dateTo ?? DateOnly.MaxValue);
        var upperRowKey = DateUtils.CreateRowKey(dateFrom ?? DateOnly.MinValue);

        return TableClient.CreateQueryFilter($"PartitionKey eq {userId} and RowKey ge {lowerRowKey} and RowKey le {upperRowKey}");
    }
}
