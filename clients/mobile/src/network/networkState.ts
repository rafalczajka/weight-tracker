import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export const OFFLINE_MESSAGE = "You're offline. Reconnect and try again.";

type ConnectivityState = Pick<
  NetInfoState,
  'isConnected' | 'isInternetReachable'
>;

let offline = false;

export function isOfflineState(state: ConnectivityState) {
  return state.isConnected === false || state.isInternetReachable === false;
}

export class OfflineError extends Error {
  constructor() {
    super(OFFLINE_MESSAGE);
    this.name = 'OfflineError';
  }
}

export async function ensureOnline() {
  const state = await NetInfo.fetch();
  updateNetworkState(state);

  if (offline) {
    throw new OfflineError();
  }
}

export function getRequestErrorMessage(error: unknown, fallback: string) {
  return error instanceof OfflineError || offline ? OFFLINE_MESSAGE : fallback;
}

export function updateNetworkState(state: ConnectivityState) {
  offline = isOfflineState(state);
}
