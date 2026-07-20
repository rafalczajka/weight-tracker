using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Services;

internal sealed class CurrentUser(IHttpContextAccessor httpContextAccessor)
{
    public string? Id => httpContextAccessor.HttpContext?.UserId;
}
