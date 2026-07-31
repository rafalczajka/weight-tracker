using PxBunny.Result;

namespace WeightTracker.Core.Errors;

public sealed class ValidationError(
    string message,
    IReadOnlyDictionary<string, string[]> errors)
    : ErrorBase(message)
{
    private const string DefaultMessage = "One or more values are invalid.";

    public ValidationError() : this(DefaultMessage) { }

    public ValidationError(string message) : this(message, new Dictionary<string, string[]>()) { }

    public IReadOnlyDictionary<string, string[]> Errors { get; } = errors;
}
