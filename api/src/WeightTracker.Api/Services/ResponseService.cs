using System.Net;

namespace WeightTracker.Api.Services;

internal sealed class ResponseService
{
    public static Result HandleResponse(ResponseTuple request) => request.Success
        ? Result.Success()
        : request.Code switch
        {
            HttpStatusCode.BadRequest => Errors.BadRequestError(),
            HttpStatusCode.Conflict => Errors.ConflictError(),
            HttpStatusCode.NotFound => Errors.NotFoundError(),
            _ => Errors.InternalError()
        };
}
