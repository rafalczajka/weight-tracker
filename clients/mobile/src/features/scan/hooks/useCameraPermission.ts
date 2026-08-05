import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';

export type CameraPermissionState =
  | 'blocked'
  | 'checking'
  | 'denied'
  | 'granted'
  | 'unavailable';

const cameraPermission =
  Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

export function useCameraPermission() {
  const isFocused = useIsFocused();
  const mounted = useRef(true);
  const hasRequested = useRef(false);
  const [state, setState] = useState<CameraPermissionState>('checking');

  const updateState = useCallback((status: PermissionStatus) => {
    if (mounted.current) {
      setState(toPermissionState(status));
    }
  }, []);

  const requestAccess = useCallback(async () => {
    hasRequested.current = true;
    setState('checking');

    try {
      updateState(await request(cameraPermission));
    } catch {
      if (mounted.current) {
        setState('unavailable');
      }
    }
  }, [updateState]);

  const refresh = useCallback(
    async (requestWhenDenied = false) => {
      try {
        const status = await check(cameraPermission);

        if (
          status === RESULTS.DENIED &&
          requestWhenDenied &&
          !hasRequested.current
        ) {
          await requestAccess();
          return;
        }

        updateState(status);
      } catch {
        if (mounted.current) {
          setState('unavailable');
        }
      }
    },
    [requestAccess, updateState],
  );

  const openApplicationSettings = useCallback(async () => {
    try {
      await openSettings('application');
    } catch {
      if (mounted.current) {
        setState('unavailable');
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh(true);
    }, [refresh]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (isFocused && nextState === 'active') {
        refresh();
      }
    });

    return () => subscription.remove();
  }, [isFocused, refresh]);

  return {
    openApplicationSettings,
    requestAccess,
    state,
  };
}

function toPermissionState(status: PermissionStatus): CameraPermissionState {
  switch (status) {
    case RESULTS.GRANTED:
    case RESULTS.LIMITED:
      return 'granted';
    case RESULTS.DENIED:
      return 'denied';
    case RESULTS.BLOCKED:
      return 'blocked';
    default:
      return 'unavailable';
  }
}
