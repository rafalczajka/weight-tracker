namespace WeightTracker.Api.ErrorDefinitions;

internal sealed class ConflictError(string message) : ErrorBase(message)
{
    private const string DefaultMessage = "The request could not be completed due to a conflict.";

    public ConflictError() : this(DefaultMessage) { }
}
