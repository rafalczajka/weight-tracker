using PxBunny.Result;

namespace WeightTracker.Core.Errors;

public sealed class NotFoundError(string message) : ErrorBase(message)
{
    private const string DefaultMessage = "The requested resource was not found.";

    public NotFoundError() : this(DefaultMessage) { }
}
