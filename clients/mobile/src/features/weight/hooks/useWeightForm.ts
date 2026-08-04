import { useState } from 'react';
import { getWeightError, parseWeightKg } from '../validation';

export function useWeightForm(initialWeightKg?: number) {
  const [weight, setWeight] = useState(
    initialWeightKg === undefined ? '' : String(initialWeightKg),
  );
  const [weightError, setWeightError] = useState<string | null>(null);

  function changeWeight(value: string) {
    setWeight(value);
    setWeightError(null);
  }

  function validateWeight() {
    setWeightError(getWeightError(weight));
  }

  function getWeightKg(): number | null {
    const parsedWeightKg = parseWeightKg(weight);

    if (parsedWeightKg === null) {
      setWeightError(getWeightError(weight));
    }

    return parsedWeightKg;
  }

  return {
    changeWeight,
    getWeightKg,
    validateWeight,
    weight,
    weightError,
  };
}
