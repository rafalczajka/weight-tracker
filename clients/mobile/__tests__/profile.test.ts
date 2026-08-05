import type { UserResponse } from '@weight-tracker/api-client';
import {
  areProfileValuesEqual,
  createEmptyProfileRequest,
  createProfileFormValues,
  createProfileRequest,
  getAdultBirthDateBounds,
  getProfileFormErrors,
} from '../src/features/account/profile';

const today = new Date('2026-08-05T12:00:00Z');

test('creates a request containing null for every empty profile field', () => {
  expect(createEmptyProfileRequest()).toEqual({
    activityLevel: null,
    dateOfBirth: null,
    heightCm: null,
    proteinGoal: null,
    sex: null,
  });
});

test('normalizes form values into a complete profile request', () => {
  expect(
    createProfileRequest({
      activityLevel: 'moderatelyActive',
      dateOfBirth: '1990-04-12',
      heightCm: '180,5',
      proteinGoal: 'muscleGain',
      sex: 'male',
    }),
  ).toEqual({
    activityLevel: 'moderatelyActive',
    dateOfBirth: '1990-04-12',
    heightCm: 180.5,
    proteinGoal: 'muscleGain',
    sex: 'male',
  });
});

test('accepts empty optional fields and rejects invalid height', () => {
  const empty = createProfileFormValues({});
  expect(getProfileFormErrors(empty, today)).toEqual({
    dateOfBirth: null,
    heightCm: null,
  });

  expect(
    getProfileFormErrors({ ...empty, heightCm: '301' }, today).heightCm,
  ).not.toBeNull();
});

test('validates adult age boundaries including leap-day birthdays', () => {
  const empty = createProfileFormValues({});

  expect(
    getProfileFormErrors(
      { ...empty, dateOfBirth: '2008-02-29' },
      new Date('2026-02-28T12:00:00Z'),
    ).dateOfBirth,
  ).toBeNull();
  expect(
    getProfileFormErrors(
      { ...empty, dateOfBirth: '2008-02-29' },
      new Date('2026-02-27T12:00:00Z'),
    ).dateOfBirth,
  ).not.toBeNull();
  expect(
    getProfileFormErrors({ ...empty, dateOfBirth: '1905-08-06' }, today)
      .dateOfBirth,
  ).toBeNull();
  expect(
    getProfileFormErrors({ ...empty, dateOfBirth: '1905-08-05' }, today)
      .dateOfBirth,
  ).not.toBeNull();
});

test('includes leap day in picker bounds when it is an eligible birthday', () => {
  const bounds = getAdultBirthDateBounds(new Date('2026-02-28T12:00:00Z'));

  expect(formatLocalDate(bounds.maximumDate)).toBe('2008-02-29');
  expect(formatLocalDate(bounds.minimumDate)).toBe('1905-03-01');
});

test('detects changes against the loaded profile', () => {
  const profile: UserResponse = {
    activityLevel: 'lightlyActive',
    dateOfBirth: '1990-04-12',
    heightCm: 180,
    proteinGoal: 'generalHealth',
    sex: 'male',
  };
  const initial = createProfileFormValues(profile);

  expect(areProfileValuesEqual(initial, { ...initial })).toBe(true);
  expect(areProfileValuesEqual(initial, { ...initial, heightCm: '181' })).toBe(
    false,
  );
});

function formatLocalDate(value: Date): string {
  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getDate()).padStart(2, '0'),
  ].join('-');
}
