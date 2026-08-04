import { useState } from 'react';
import {
  getCaloriesError,
  getDescriptionError,
  parseCaloriesKcal,
} from '../validation';

export function useCalorieForm(
  initialCaloriesKcal?: number,
  initialDescription?: string | null,
) {
  const [calories, setCalories] = useState(
    initialCaloriesKcal === undefined ? '' : String(initialCaloriesKcal),
  );
  const [description, setDescription] = useState(initialDescription ?? '');
  const [caloriesError, setCaloriesError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  function changeCalories(value: string) {
    setCalories(value);
    setCaloriesError(null);
  }

  function changeDescription(value: string) {
    setDescription(value);
    setDescriptionError(null);
  }

  function validateCalories() {
    setCaloriesError(getCaloriesError(calories));
  }

  function validateDescription() {
    setDescriptionError(getDescriptionError(description));
  }

  function getValues(): {
    caloriesKcal: number;
    description: string | null;
  } | null {
    const parsedCalories = parseCaloriesKcal(calories);
    const nextCaloriesError = getCaloriesError(calories);
    const nextDescriptionError = getDescriptionError(description);

    setCaloriesError(nextCaloriesError);
    setDescriptionError(nextDescriptionError);

    if (parsedCalories === null || nextDescriptionError) {
      return null;
    }

    return {
      caloriesKcal: parsedCalories,
      description: description.trim() || null,
    };
  }

  return {
    calories,
    caloriesError,
    changeCalories,
    changeDescription,
    description,
    descriptionError,
    getValues,
    validateCalories,
    validateDescription,
  };
}
