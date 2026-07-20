using Microsoft.AspNetCore.OutputCaching;
using Microsoft.Extensions.Primitives;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Cache;

internal sealed class CustomCachePolicy : IOutputCachePolicy
{
    public ValueTask CacheRequestAsync(OutputCacheContext context, CancellationToken _)
    {
        const string anonymousUid = "anonymous";
        const string userUidKey = "uid";

        var attemptOutputCaching = AttemptOutputCaching(context);

        context.EnableOutputCaching = true;
        context.AllowCacheLookup = attemptOutputCaching;
        context.AllowCacheStorage = attemptOutputCaching;
        context.AllowLocking = true;

        var uid = context.HttpContext.UserId ?? anonymousUid;
        context.CacheVaryByRules.VaryByValues[userUidKey] = uid;
        context.CacheVaryByRules.QueryKeys = "*";

        return ValueTask.CompletedTask;
    }

    public ValueTask ServeFromCacheAsync(OutputCacheContext context, CancellationToken _) => ValueTask.CompletedTask;

    public ValueTask ServeResponseAsync(OutputCacheContext context, CancellationToken _)
    {
        var response = context.HttpContext.Response;
        var uid = context.HttpContext.UserId;

        var setsCookie = !StringValues.IsNullOrEmpty(response.Headers.SetCookie);
        var isOkStatus = response.StatusCode == StatusCodes.Status200OK;

        if (setsCookie || !isOkStatus) context.AllowCacheStorage = false;

        if (!string.IsNullOrWhiteSpace(uid)) context.Tags.Add($"user:{uid}");

        return ValueTask.CompletedTask;
    }

    private static bool AttemptOutputCaching(OutputCacheContext context)
    {
        var request = context.HttpContext.Request;
        return HttpMethods.IsGet(request.Method);
    }
}
