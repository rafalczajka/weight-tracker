using Microsoft.AspNetCore.Authorization;

namespace WeightTracker.Api.Auth;

internal sealed record ApiAccessRequirement(string Scope) : IAuthorizationRequirement;
