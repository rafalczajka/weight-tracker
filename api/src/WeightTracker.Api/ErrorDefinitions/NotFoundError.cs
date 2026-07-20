namespace WeightTracker.Api.ErrorDefinitions;

internal sealed class NotFoundError(string message) : ErrorBase(message)
{
    private const string DefaultMessage = "The requested resource was not found.";

    public NotFoundError() : this(DefaultMessage) { }
}
