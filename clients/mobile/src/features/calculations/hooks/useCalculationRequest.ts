import { useFocusEffect } from '@react-navigation/native';
import { ApiError } from '@weight-tracker/api-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AuthSessionController } from '@/auth';
import { runAuthorized } from '@/auth';
import type { StatusNoticeValue } from '@/components';
import { useRequestController } from '@/hooks/useRequestController';
import {
  getValidationRequirements,
  type CalculationKind,
  type CalculationRequirement,
} from '../requirements';

interface UseCalculationRequestOptions<TResult> {
  auth: AuthSessionController;
  kind: CalculationKind;
  request: (accessToken: string, signal: AbortSignal) => Promise<TResult>;
  revision: number;
}

export function useCalculationRequest<TResult>({
  auth,
  kind,
  request,
  revision,
}: UseCalculationRequestOptions<TResult>) {
  const authRef = useRef(auth);
  const requestRef = useRef(request);
  authRef.current = auth;
  requestRef.current = request;
  const [calculating, setCalculating] = useState(false);
  const [notice, setNotice] = useState<StatusNoticeValue | null>(null);
  const [result, setResult] = useState<TResult | null>(null);
  const [validationRequirements, setValidationRequirements] = useState<
    CalculationRequirement[]
  >([]);
  const { abortRequest, startRequest } = useRequestController();

  useEffect(() => {
    abortRequest();
    setCalculating(false);
    setNotice(null);
    setResult(null);
    setValidationRequirements([]);
  }, [abortRequest, revision]);

  useFocusEffect(
    useCallback(
      () => () => {
        abortRequest();
        setCalculating(false);
      },
      [abortRequest],
    ),
  );

  const calculate = useCallback(async () => {
    if (calculating) {
      return;
    }

    const controller = startRequest();
    setCalculating(true);
    setNotice(null);
    setResult(null);
    setValidationRequirements([]);

    try {
      const calculatedResult = await runAuthorized(
        authRef.current,
        accessToken => requestRef.current(accessToken, controller.signal),
      );

      if (calculatedResult && !controller.signal.aborted) {
        setResult(calculatedResult);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        const requirements =
          error instanceof ApiError && error.validationErrors
            ? getValidationRequirements(kind, error.validationErrors)
            : [];
        setValidationRequirements(requirements);
        setNotice({
          kind: 'error',
          text:
            requirements.length > 0
              ? 'Some required data is still missing.'
              : 'Unable to calculate the result.',
        });
      }
    } finally {
      if (!controller.signal.aborted) {
        setCalculating(false);
      }
    }
  }, [calculating, kind, startRequest]);

  return {
    calculate,
    calculating,
    notice,
    result,
    validationRequirements,
  };
}
