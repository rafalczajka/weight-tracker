using PxBunny.Result;

namespace WeightTracker.Core.Errors;

public sealed class ExternalServiceError(string message) : ErrorBase(message)
{
    private const string DefaultMessage = "An external service could not complete the operation.";

    public ExternalServiceError() : this(DefaultMessage) { }
}
