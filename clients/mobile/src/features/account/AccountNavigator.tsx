import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { createStackScreenOptions } from '@/navigation/options';
import { useMutationTracker } from '@/mutations';
import type { ThemeColors } from '@/theme';
import { AccountScreen } from './AccountScreen';

export type AccountStackParamList = {
  AccountOverview: undefined;
};

const Stack = createNativeStackNavigator<AccountStackParamList>();

interface AccountNavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
}

export function AccountNavigator({ auth, colors }: AccountNavigatorProps) {
  const mutations = useMutationTracker();

  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen name="AccountOverview" options={{ title: 'Account' }}>
        {() => (
          <AccountScreen
            colors={colors}
            disabled={auth.busy || mutations.busy}
            loading={auth.signingOut}
            notice={auth.notice}
            onSignOut={auth.signOut}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
