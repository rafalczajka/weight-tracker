using System.Globalization;

namespace WeightTracker.Api.Endpoints.User;

internal static class UserMappings
{
    public static UserResponse ToResponse(this UserProfile profile) => new(
        profile.HeightCm,
        profile.Sex,
        profile.DateOfBirth?.ToDomainDateString(),
        profile.ActivityLevel,
        profile.ProteinGoal);

    public static UserProfile ToDomain(this Put.UserPutRequest request, string userId) => new(
        userId,
        request.HeightCm,
        request.Sex,
        request.DateOfBirth is null
            ? null
            : DateOnly.ParseExact(
                request.DateOfBirth,
                Constants.DateFormat,
                CultureInfo.InvariantCulture),
        request.ActivityLevel,
        request.ProteinGoal);
}
