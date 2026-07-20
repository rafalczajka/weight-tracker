using Microsoft.AspNetCore.Builder;

namespace WeightTracker.Api.Extensions;

internal static class RouteHandlerBuilderExtensions
{
    public static RouteHandlerBuilder ProducesCommonProblems(this RouteHandlerBuilder builder) => builder
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);

    public static RouteHandlerBuilder ProducesWriteCommonProblems(this RouteHandlerBuilder builder) => builder
        .ProducesCommonProblems()
        .Produces(StatusCodes.Status409Conflict);
}
