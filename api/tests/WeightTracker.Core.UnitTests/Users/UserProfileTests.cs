using WeightTracker.Core.Users;

namespace WeightTracker.Core.UnitTests.Users;

public sealed class UserProfileTests
{
    [Fact]
    public void Empty_CreatesProfileWithoutOptionalData()
    {
        var result = UserProfile.Empty("user-id");

        Assert.Equal("user-id", result.UserId);
        Assert.Null(result.HeightCm);
        Assert.Null(result.Sex);
        Assert.Null(result.DateOfBirth);
        Assert.Null(result.ActivityLevel);
        Assert.Null(result.ProteinGoal);
    }
}
