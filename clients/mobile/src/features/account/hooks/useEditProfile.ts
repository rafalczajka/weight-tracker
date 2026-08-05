import {
  ApiError,
  updateUserProfile,
  withBearerToken,
  type UserResponse,
} from '@weight-tracker/api-client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import type { StatusNoticeValue } from '@/components';
import { useMutationTracker } from '@/mutations';
import { getRequestErrorMessage } from '@/network';
import {
  areProfileValuesEqual,
  createEmptyProfileRequest,
  createProfileFormValues,
  createProfileRequest,
  getAdultBirthDateBounds,
  getProfileFormErrors,
  hasProfileFormErrors,
  type ProfileFormErrors,
  type ProfileFormValues,
} from '../profile';
import { useUserProfile } from './useUserProfile';

interface UseEditProfileOptions {
  auth: AuthSessionController;
  onSaved: (message: string) => void;
}

const EMPTY_ERRORS: ProfileFormErrors = {
  dateOfBirth: null,
  heightCm: null,
};

export function useEditProfile({ auth, onSaved }: UseEditProfileOptions) {
  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;
  const profileState = useUserProfile(auth);
  const { runMutation } = useMutationTracker();
  const [initialValues, setInitialValues] = useState<ProfileFormValues | null>(
    null,
  );
  const [values, setValues] = useState<ProfileFormValues | null>(null);
  const [errors, setErrors] = useState<ProfileFormErrors>(EMPTY_ERRORS);
  const [notice, setNotice] = useState<StatusNoticeValue | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(
    null,
  );
  const birthDateBounds = useMemo(() => getAdultBirthDateBounds(), []);

  useEffect(() => {
    if (profileState.profile && !initialValues) {
      const loadedValues = createProfileFormValues(profileState.profile);
      setInitialValues(loadedValues);
      setValues(loadedValues);
    }
  }, [initialValues, profileState.profile]);

  useEffect(() => {
    if (completionMessage) {
      setCompletionMessage(null);
      onSavedRef.current(completionMessage);
    }
  }, [completionMessage]);

  const dirty = Boolean(
    initialValues && values && !areProfileValuesEqual(initialValues, values),
  );

  function changeValue<K extends keyof ProfileFormValues>(
    field: K,
    value: ProfileFormValues[K],
  ) {
    setValues(current => (current ? { ...current, [field]: value } : current));
    setNotice(null);

    if (field === 'heightCm' || field === 'dateOfBirth') {
      setErrors(current => ({ ...current, [field]: null }));
    }
  }

  function validateField(field: keyof ProfileFormErrors) {
    if (!values) {
      return;
    }

    const nextErrors = getProfileFormErrors(values);
    setErrors(current => ({ ...current, [field]: nextErrors[field] }));
  }

  async function save() {
    if (!values || submitting) {
      return;
    }

    const nextErrors = getProfileFormErrors(values);
    setErrors(nextErrors);

    if (hasProfileFormErrors(nextErrors)) {
      return;
    }

    await persist(createProfileRequest(values), 'Profile updated.');
  }

  function confirmClear() {
    if (submitting) {
      return;
    }

    Alert.alert(
      'Clear profile?',
      'All profile values will be permanently cleared.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () =>
            persist(createEmptyProfileRequest(), 'Profile cleared.'),
          style: 'destructive',
          text: 'Clear',
        },
      ],
    );
  }

  async function persist(
    body: ReturnType<typeof createProfileRequest>,
    successMessage: string,
  ) {
    Keyboard.dismiss();
    setSubmitting(true);
    setNotice(null);

    try {
      const profile = await runMutation(() =>
        runAuthorized(auth, async accessToken => {
          const response = await updateUserProfile({
            ...withBearerToken(apiClient, accessToken),
            body,
          });

          return response.data;
        }),
      );

      if (profile) {
        complete(profile, successMessage);
      }
    } catch (error) {
      applyServerErrors(error);
      setNotice({
        kind: 'error',
        text: getRequestErrorMessage(error, 'Unable to update your profile.'),
      });
    } finally {
      setSubmitting(false);
    }
  }

  function complete(profile: UserResponse, message: string) {
    const savedValues = createProfileFormValues(profile);
    setInitialValues(savedValues);
    setValues(savedValues);
    setErrors(EMPTY_ERRORS);
    setCompletionMessage(message);
  }

  function applyServerErrors(error: unknown) {
    if (!(error instanceof ApiError) || !error.validationErrors) {
      return;
    }

    const heightCm = findValidationMessage(error.validationErrors, 'heightCm');
    const dateOfBirth = findValidationMessage(
      error.validationErrors,
      'dateOfBirth',
    );
    setErrors(current => ({
      dateOfBirth: dateOfBirth ?? current.dateOfBirth,
      heightCm: heightCm ?? current.heightCm,
    }));
  }

  return {
    ...profileState,
    authBusy: auth.busy,
    birthDateBounds,
    changeValue,
    confirmClear,
    dirty,
    errors,
    notice,
    save,
    submitting,
    validateField,
    values,
  };
}

function findValidationMessage(
  errors: Readonly<Record<string, readonly string[]>>,
  field: string,
): string | undefined {
  const entry = Object.entries(errors).find(
    ([key]) => key.toLowerCase() === field.toLowerCase(),
  );
  return entry?.[1][0];
}
