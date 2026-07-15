import { useState } from 'react';
import { Keyboard } from 'react-native';
import { addTodayWeight, ApiError } from '../../api';
import { getWeightError, parseWeight } from './validation';

type Operation = 'submitting' | null;
export type NoticeKind = 'error' | 'info' | 'success';

export interface Notice {
  kind: NoticeKind;
  text: string;
}

export interface WeightEntryController {
  weight: string;
  weightError: string | null;
  notice: Notice | null;
  formDisabled: boolean;
  submitting: boolean;
  changeWeight: (value: string) => void;
  validateWeight: () => void;
  submitWeight: () => Promise<void>;
}

interface UseWeightEntryOptions {
  getAccessToken: () => Promise<string | null>;
  onUnauthorized: () => Promise<void>;
}

export function useWeightEntry({
  getAccessToken,
  onUnauthorized,
}: UseWeightEntryOptions): WeightEntryController {
  const [operation, setOperation] = useState<Operation>(null);
  const [weight, setWeight] = useState('');
  const [weightError, setWeightError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [completed, setCompleted] = useState(false);

  async function submitWeight() {
    if (operation || completed) {
      return;
    }

    const parsedWeight = parseWeight(weight);

    if (parsedWeight === null) {
      setWeightError(getWeightError(weight));
      return;
    }

    Keyboard.dismiss();
    setOperation('submitting');
    setWeightError(null);
    setNotice(null);

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        return;
      }

      const result = await addTodayWeight(parsedWeight, accessToken);

      setWeight('');
      setCompleted(true);
      setNotice(
        result === 'created'
          ? { kind: 'success', text: 'Weight added for today.' }
          : {
              kind: 'info',
              text: 'Weight for today has already been added.',
            },
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await onUnauthorized();
      } else {
        setNotice({
          kind: 'error',
          text: 'Unable to add weight. Try again.',
        });
      }
    } finally {
      setOperation(null);
    }
  }

  function changeWeight(value: string) {
    setWeight(value);
    setWeightError(null);
    setNotice(null);
  }

  function validateWeight() {
    if (!completed) {
      setWeightError(getWeightError(weight));
    }
  }

  return {
    weight,
    weightError,
    notice,
    formDisabled: operation !== null || completed,
    submitting: operation === 'submitting',
    changeWeight,
    validateWeight,
    submitWeight,
  };
}
