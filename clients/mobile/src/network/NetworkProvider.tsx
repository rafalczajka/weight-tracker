import { useNetInfo } from '@react-native-community/netinfo';
import React, {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ThemeColors } from '@/theme';
import { isOfflineState, updateNetworkState } from './networkState';

const NetworkContext = createContext(false);

interface NetworkProviderProps {
  children: ReactNode;
}

export function NetworkProvider({ children }: NetworkProviderProps) {
  const networkState = useNetInfo();
  const isOffline = isOfflineState(networkState);

  useEffect(() => {
    updateNetworkState(networkState);
  }, [networkState]);

  return (
    <NetworkContext.Provider value={isOffline}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useIsOffline() {
  return useContext(NetworkContext);
}

export function OfflineBanner({ colors }: { colors: ThemeColors }) {
  const isOffline = useIsOffline();

  if (!isOffline) {
    return null;
  }

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: colors.input }}>
      <View
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={[styles.banner, { borderColor: colors.error }]}
      >
        <Text style={[styles.text, { color: colors.error }]}>
          You're offline
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    borderBottomWidth: 1,
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 20,
  },
});
