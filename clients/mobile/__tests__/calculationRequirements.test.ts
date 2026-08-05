import type { UserResponse } from '@weight-tracker/api-client';
import {
  getMissingRequirements,
  getValidationRequirements,
  type CalculationContextData,
} from '../src/features/calculations/requirements';

const completeProfile: UserResponse = {
  activityLevel: 'moderatelyActive',
  dateOfBirth: '1990-02-28',
  heightCm: 180,
  proteinGoal: 'muscleGain',
  sex: 'male',
};

function context(
  profile: UserResponse = completeProfile,
): CalculationContextData {
  return {
    latestWeight: { date: '2026-08-05', weightKg: 80 },
    profile,
  };
}

describe('calculation requirements', () => {
  test.each(['bmi', 'calories', 'protein'] as const)(
    'accepts complete data for %s',
    kind => {
      expect(getMissingRequirements(kind, context())).toEqual([]);
    },
  );

  test('reports profile and weight requirements for BMI', () => {
    const missing = getMissingRequirements('bmi', {
      latestWeight: null,
      profile: {},
    });

    expect(missing.map(requirement => requirement.field)).toEqual([
      'weightKg',
      'heightCm',
    ]);
    expect(missing.map(requirement => requirement.source)).toEqual([
      'weight',
      'profile',
    ]);
  });

  test('reports all missing calorie inputs', () => {
    const missing = getMissingRequirements('calories', {
      latestWeight: null,
      profile: {},
    });

    expect(missing.map(requirement => requirement.field)).toEqual([
      'weightKg',
      'heightCm',
      'ageYears',
      'sex',
      'activityLevel',
    ]);
  });

  test('maps the protein goal to profile and weight to history', () => {
    const missing = getMissingRequirements(
      'protein',
      context({ ...completeProfile, proteinGoal: null }),
    );

    expect(missing).toEqual([
      expect.objectContaining({ field: 'goal', source: 'profile' }),
    ]);
  });

  test('maps validation errors case-insensitively to available actions', () => {
    const missing = getValidationRequirements('calories', {
      ActivityLevel: ['Activity level is required.'],
      WeightKg: ['Weight is required.'],
      unknown: ['Unknown field.'],
    });

    expect(missing).toEqual([
      expect.objectContaining({ field: 'weightKg', source: 'weight' }),
      expect.objectContaining({
        field: 'activityLevel',
        source: 'profile',
      }),
    ]);
  });
});
