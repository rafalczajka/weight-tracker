using System.Net;

using ResultErrors = PxBunny.Result.Errors;

namespace WeightTracker.Api.Services;

internal sealed class ResponseService
{
    public static Result HandleResponse(ResponseTuple request) => request.Success
        ? Result.Success()
        : request.Code switch
        {
            HttpStatusCode.BadRequest => ResultErrors.BadRequestError(),
            HttpStatusCode.Conflict => ResultErrors.ConflictError(),
            HttpStatusCode.NotFound => ResultErrors.NotFoundError(),
            _ => ResultErrors.InternalError()
        };
}
