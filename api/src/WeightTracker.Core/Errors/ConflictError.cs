using PxBunny.Result;

namespace WeightTracker.Core.Errors;

public sealed class ConflictError(string message) : ErrorBase(message)
{
    private const string DefaultMessage = "The operation conflicts with the current state.";

    public ConflictError() : this(DefaultMessage) { }
}
