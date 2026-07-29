using PxBunny.Result;
using WeightTracker.Core.Errors;

namespace WeightTracker.Api.Extensions;

internal static class ResultExtensions
{
    public static IResult Handle(this Result result, Func<IResult> onSuccess) =>
        result.Match(onSuccess, HandleError);

    public static IResult Handle<T>(this Result<T> result, Func<T, IResult> onSuccess) =>
        result.Match(onSuccess, HandleError);

    public static Task<IResult> HandleAsync(
        this Result result,
        Func<Task<IResult>> onSuccess) =>
        result.Match(onSuccess, error => Task.FromResult(HandleError(error)));

    public static Task<IResult> HandleAsync<T>(
        this Result<T> result,
        Func<T, Task<IResult>> onSuccess) =>
        result.Match(onSuccess, error => Task.FromResult(HandleError(error)));

    private static IResult HandleError(ErrorBase error) => error switch
    {
        ValidationError => Results.BadRequest(),
        ConflictError => Results.Conflict(),
        NotFoundError => Results.NotFound(),
        ExternalServiceError => Results.StatusCode(StatusCodes.Status502BadGateway),
        _ => throw new InvalidOperationException($"Unsupported result error: {error.GetType().Name}.")
    };
}
