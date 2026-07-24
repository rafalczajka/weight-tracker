namespace WeightTracker.Api.Auth;

internal sealed class CurrentUser(IHttpContextAccessor httpContextAccessor)
{
    public string? Id => httpContextAccessor.HttpContext?.UserId;
}
