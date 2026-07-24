using System.Linq;
using System.Security.Claims;
using AspNetCore.Authentication.ApiKey;
using Microsoft.AspNetCore.Authorization;

namespace WeightTracker.Api.Auth;

internal sealed class ApiAccessHandler : AuthorizationHandler<ApiAccessRequirement>
{
    private static readonly string[] ScopeClaimTypes =
    [
        "scp",
        "scope",
        "http://schemas.microsoft.com/identity/claims/scope"
    ];

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ApiAccessRequirement requirement)
    {
        if (context.User.Identities.Any(identity => HasAccess(identity, requirement.Scope)))
            context.Succeed(requirement);

        return Task.CompletedTask;
    }

    private static bool HasAccess(ClaimsIdentity identity, string requiredScope) =>
        identity.IsAuthenticated &&
        (string.Equals(identity.AuthenticationType, ApiKeyDefaults.AuthenticationScheme, StringComparison.Ordinal) ||
         HasScope(identity, requiredScope));

    private static bool HasScope(ClaimsIdentity identity, string requiredScope) =>
        identity.Claims
            .Where(claim => ScopeClaimTypes.Contains(claim.Type, StringComparer.Ordinal))
            .SelectMany(claim => claim.Value.Split(' ',
                StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            .Contains(requiredScope, StringComparer.Ordinal);
}
