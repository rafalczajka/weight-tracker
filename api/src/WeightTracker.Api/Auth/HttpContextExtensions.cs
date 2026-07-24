using System.Security.Claims;

namespace WeightTracker.Api.Auth;

internal static class HttpContextExtensions
{
    extension(HttpContext context)
    {
        public string? UserId => context.User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
