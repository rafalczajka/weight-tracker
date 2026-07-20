import type { WeightsGetResponse } from '@weight-tracker/api-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ApiError, getWeightHistory } from '../../api';
import { createHistoryQuery, type WeightHistoryRange } from './range';

export interface WeightHistoryNotice {
  kind: 'error';
  text: string;
}

export interface WeightHistoryController {
  loading: boolean;
  notice: WeightHistoryNotice | null;
  range: WeightHistoryRange;
  refreshing: boolean;
  report: WeightsGetResponse | null;
  changeRange: (range: WeightHistoryRange) => void;
  refresh: () => void;
}

interface UseWeightHistoryOptions {
  getAccessToken: () => Promise<string | null>;
  onUnauthorized: () => Promise<void>;
}

export function useWeightHistory({
  getAccessToken,
  onUnauthorized,
}: UseWeightHistoryOptions): WeightHistoryController {
  const [range, setRange] = useState<WeightHistoryRange>('90d');
  const [report, setReport] = useState<WeightsGetResponse | null>(null);
  const [notice, setNotice] = useState<WeightHistoryNotice | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasReportRef = useRef(false);
  const activeRequestRef = useRef<AbortController | null>(null);
  const getAccessTokenRef = useLatestValue(getAccessToken);
  const onUnauthorizedRef = useLatestValue(onUnauthorized);

  const cancelActiveRequest = useCallback(() => {
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
  }, []);

  const loadHistory = useCallback(
    async (signal: AbortSignal) => {
      const hasReport = hasReportRef.current;

      setLoading(!hasReport);
      setRefreshing(hasReport);
      setNotice(null);

      try {
        const accessToken = await getAccessTokenRef.current();

        if (!accessToken || signal.aborted) {
          return;
        }

        const nextReport = await getWeightHistory(
          accessToken,
          createHistoryQuery(range),
          signal,
        );

        if (!signal.aborted) {
          hasReportRef.current = true;
          setReport(nextReport);
        }
      } catch (error) {
        if (signal.aborted) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          await onUnauthorizedRef.current();
        } else {
          setNotice({
            kind: 'error',
            text: 'Unable to load weight history. Try again.',
          });
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [getAccessTokenRef, onUnauthorizedRef, range],
  );

  const startRequest = useCallback(() => {
    cancelActiveRequest();

    const request = new AbortController();
    activeRequestRef.current = request;

    loadHistory(request.signal)
      .catch(() => undefined)
      .finally(() => {
        if (activeRequestRef.current === request) {
          activeRequestRef.current = null;
        }
      });
  }, [cancelActiveRequest, loadHistory]);

  useFocusEffect(
    useCallback(() => {
      startRequest();

      return cancelActiveRequest;
    }, [cancelActiveRequest, startRequest]),
  );

  function changeRange(nextRange: WeightHistoryRange) {
    if (nextRange === range) {
      return;
    }

    cancelActiveRequest();
    hasReportRef.current = false;
    setReport(null);
    setNotice(null);
    setLoading(true);
    setRange(nextRange);
  }

  function refresh() {
    startRequest();
  }

  return {
    loading,
    notice,
    range,
    refreshing,
    report,
    changeRange,
    refresh,
  };
}

function useLatestValue<T>(value: T) {
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
}
