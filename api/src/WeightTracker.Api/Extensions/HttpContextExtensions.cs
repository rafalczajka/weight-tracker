using System.Security.Claims;

namespace WeightTracker.Api.Extensions;

internal static class HttpContextExtensions
{
    extension(HttpContext context)
    {
        public string? UserId => context.User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
