import { useCallback, useEffect, useRef } from 'react';

export function useRequestController() {
  const activeRequest = useRef<AbortController | null>(null);

  const abortRequest = useCallback(() => {
    activeRequest.current?.abort();
    activeRequest.current = null;
  }, []);

  const startRequest = useCallback(() => {
    activeRequest.current?.abort();

    const controller = new AbortController();
    activeRequest.current = controller;
    return controller;
  }, []);

  useEffect(() => abortRequest, [abortRequest]);

  return { abortRequest, startRequest };
}
