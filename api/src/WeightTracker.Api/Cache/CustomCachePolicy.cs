using Microsoft.AspNetCore.OutputCaching;
using Microsoft.Extensions.Primitives;

namespace WeightTracker.Api.Cache;

internal class CustomCachePolicy : IOutputCachePolicy
{
    public ValueTask CacheRequestAsync(OutputCacheContext context, CancellationToken _)
    {
        var allowCaching = IsCacheableRequest(context);

        context.EnableOutputCaching = true;
        context.AllowCacheLookup = allowCaching;
        context.AllowCacheStorage = allowCaching;
        context.AllowLocking = true;

        if (allowCaching)
        {
            context.CacheVaryByRules.QueryKeys = "*";
            ConfigureCacheKey(context);
        }

        return ValueTask.CompletedTask;
    }

    public ValueTask ServeFromCacheAsync(OutputCacheContext context, CancellationToken _) => ValueTask.CompletedTask;

    public ValueTask ServeResponseAsync(OutputCacheContext context, CancellationToken _)
    {
        var response = context.HttpContext.Response;
        var setsCookie = !StringValues.IsNullOrEmpty(response.Headers.SetCookie);
        var isOkStatus = response.StatusCode == StatusCodes.Status200OK;

        if (setsCookie || !isOkStatus)
        {
            context.AllowCacheStorage = false;
            return ValueTask.CompletedTask;
        }

        AddCacheTags(context);
        return ValueTask.CompletedTask;
    }

    protected virtual void ConfigureCacheKey(OutputCacheContext context)
    {
    }

    protected virtual void AddCacheTags(OutputCacheContext context)
    {
    }

    private static bool IsCacheableRequest(OutputCacheContext context)
    {
        var httpContext = context.HttpContext;

        return HttpMethods.IsGet(httpContext.Request.Method)
            && httpContext.User.Identity?.IsAuthenticated == true
            && !string.IsNullOrWhiteSpace(httpContext.UserId);
    }
}
