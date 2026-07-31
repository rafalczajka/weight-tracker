import {
  getUserProfile,
  updateUserProfile,
  withBearerToken,
  type Client,
  type UserPutRequest,
  type UserResponse,
} from '@weight-tracker/api-client';

export async function getProfile(
  api: Client,
  accessToken: string,
): Promise<UserResponse> {
  const response = await getUserProfile({
    ...withBearerToken(api, accessToken),
  });

  return response.data;
}

export async function putProfile(
  api: Client,
  accessToken: string,
  profile: UserPutRequest,
): Promise<UserResponse> {
  const response = await updateUserProfile({
    ...withBearerToken(api, accessToken),
    body: profile,
  });

  return response.data;
}

export function toProfileRequest(profile: UserResponse): UserPutRequest {
  return {
    activityLevel: profile.activityLevel ?? null,
    dateOfBirth: profile.dateOfBirth ?? null,
    heightCm: profile.heightCm ?? null,
    proteinGoal: profile.proteinGoal ?? null,
    sex: profile.sex ?? null,
  };
}
