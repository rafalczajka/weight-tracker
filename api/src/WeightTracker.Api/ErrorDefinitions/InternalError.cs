namespace WeightTracker.Api.ErrorDefinitions;

internal sealed class InternalError(string message) : ErrorBase(message)
{
    private const string DefaultMessage = "An unexpected error occurred on the server.";

    public InternalError() : this(DefaultMessage) { }
}
