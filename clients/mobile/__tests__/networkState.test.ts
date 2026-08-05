import { getRequestErrorMessage, OFFLINE_MESSAGE } from '../src/network';
import {
  isOfflineState,
  updateNetworkState,
} from '../src/network/networkState';

afterEach(() => {
  updateNetworkState({ isConnected: null, isInternetReachable: null });
});

test.each([
  [{ isConnected: false, isInternetReachable: true }, true],
  [{ isConnected: true, isInternetReachable: false }, true],
  [{ isConnected: false, isInternetReachable: null }, true],
  [{ isConnected: null, isInternetReachable: false }, true],
  [{ isConnected: true, isInternetReachable: true }, false],
  [{ isConnected: null, isInternetReachable: null }, false],
])('detects explicit offline state for %o', (state, expected) => {
  expect(isOfflineState(state)).toBe(expected);
});

test('maps a failed request to the offline message after connectivity is lost', () => {
  updateNetworkState({ isConnected: false, isInternetReachable: null });

  expect(
    getRequestErrorMessage(new Error('Network request failed'), 'Fallback'),
  ).toBe(OFFLINE_MESSAGE);
});

test('keeps the fallback when connectivity is not known to be offline', () => {
  updateNetworkState({ isConnected: null, isInternetReachable: null });

  expect(getRequestErrorMessage(new Error('Request failed'), 'Fallback')).toBe(
    'Fallback',
  );
});
