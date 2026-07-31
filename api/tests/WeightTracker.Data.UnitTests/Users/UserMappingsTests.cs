using WeightTracker.Core.Users;
using WeightTracker.Data.Users;

namespace WeightTracker.Data.UnitTests.Users;

public sealed class UserMappingsTests
{
    [Fact]
    public void Mapping_RoundTripsCompleteProfile()
    {
        var profile = new UserProfile(
            "user-id",
            180.5m,
            Sex.Male,
            new DateOnly(1990, 5, 20),
            ActivityLevel.ModeratelyActive,
            ProteinGoal.MuscleGain);

        var entity = profile.ToEntity();
        var result = entity.ToDomain();

        Assert.Equal(profile, result);
        Assert.Equal("user-id", entity.PartitionKey);
        Assert.Equal(UserEntity.ProfileRowKey, entity.RowKey);
        Assert.Equal("Male", entity.Sex);
        Assert.Equal("1990-05-20", entity.DateOfBirth);
        Assert.Equal("ModeratelyActive", entity.ActivityLevel);
        Assert.Equal("MuscleGain", entity.ProteinGoal);
    }

    [Fact]
    public void Mapping_RoundTripsEmptyProfile()
    {
        var profile = UserProfile.Empty("user-id");

        var entity = profile.ToEntity();
        var result = entity.ToDomain();

        Assert.Equal(profile, result);
        Assert.Null(entity.HeightCm);
        Assert.Null(entity.Sex);
        Assert.Null(entity.DateOfBirth);
        Assert.Null(entity.ActivityLevel);
        Assert.Null(entity.ProteinGoal);
    }
}
