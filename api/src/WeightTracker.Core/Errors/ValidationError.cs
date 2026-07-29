using PxBunny.Result;

namespace WeightTracker.Core.Errors;

public sealed class ValidationError(string message) : ErrorBase(message)
{
    private const string DefaultMessage = "One or more values are invalid.";

    public ValidationError() : this(DefaultMessage) { }
}
