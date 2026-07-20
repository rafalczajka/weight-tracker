namespace WeightTracker.Api.ErrorDefinitions;

internal sealed class BadRequestError(string message) : ErrorBase(message)
{
    private const string DefaultMessage = "The request could not be processed due to invalid input.";

    public BadRequestError() : this(DefaultMessage) { }
}
