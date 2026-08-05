import type {
  UserResponse,
  ValidationErrors,
  WeightsEntryResponse,
} from '@weight-tracker/api-client';

export type CalculationKind = 'bmi' | 'calories' | 'protein';
export type RequirementSource = 'profile' | 'weight';

export interface CalculationContextData {
  latestWeight: WeightsEntryResponse | null;
  profile: UserResponse;
}

export interface CalculationRequirement {
  field: string;
  label: string;
  message: string;
  source: RequirementSource;
}

const REQUIREMENTS: Record<CalculationKind, readonly CalculationRequirement[]> =
  {
    bmi: [weightRequirement(), profileRequirement('heightCm', 'Height')],
    calories: [
      weightRequirement(),
      profileRequirement('heightCm', 'Height'),
      profileRequirement('ageYears', 'Date of birth'),
      profileRequirement('sex', 'Sex'),
      profileRequirement('activityLevel', 'Activity level'),
    ],
    protein: [weightRequirement(), profileRequirement('goal', 'Protein goal')],
  };

export function getMissingRequirements(
  kind: CalculationKind,
  context: CalculationContextData,
): CalculationRequirement[] {
  return REQUIREMENTS[kind].filter(
    requirement => !hasRequirementValue(requirement.field, context),
  );
}

export function getValidationRequirements(
  kind: CalculationKind,
  errors: ValidationErrors,
): CalculationRequirement[] {
  const fields = new Set(Object.keys(errors).map(key => key.toLowerCase()));

  return REQUIREMENTS[kind].filter(requirement =>
    fields.has(requirement.field.toLowerCase()),
  );
}

export function mergeCalculationRequirements(
  ...groups: readonly CalculationRequirement[][]
): CalculationRequirement[] {
  const requirements = new Map<string, CalculationRequirement>();

  for (const requirement of groups.flat()) {
    requirements.set(requirement.field, requirement);
  }

  return [...requirements.values()];
}

function hasRequirementValue(
  field: string,
  { latestWeight, profile }: CalculationContextData,
): boolean {
  switch (field) {
    case 'weightKg':
      return latestWeight !== null;
    case 'heightCm':
      return profile.heightCm != null;
    case 'ageYears':
      return profile.dateOfBirth != null;
    case 'sex':
      return profile.sex != null;
    case 'activityLevel':
      return profile.activityLevel != null;
    case 'goal':
      return profile.proteinGoal != null;
    default:
      return false;
  }
}

function weightRequirement(): CalculationRequirement {
  return {
    field: 'weightKg',
    label: 'Weight',
    message: 'Add a weight entry to use your latest weight.',
    source: 'weight',
  };
}

function profileRequirement(
  field: string,
  label: string,
): CalculationRequirement {
  return {
    field,
    label,
    message: `Set ${label.toLowerCase()} in your profile.`,
    source: 'profile',
  };
}
