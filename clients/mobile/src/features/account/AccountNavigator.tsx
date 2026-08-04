import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { AuthSessionController } from '../../auth';
import { createStackScreenOptions } from '../../navigation/options';
import type { ThemeColors } from '../../theme';
import type { AddWeightController } from '../weight';
import { AccountScreen } from './AccountScreen';

type AccountStackParamList = {
  Account: undefined;
};

const Stack = createNativeStackNavigator<AccountStackParamList>();

interface AccountNavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  addWeight: AddWeightController;
}

export function AccountNavigator({
  auth,
  colors,
  addWeight,
}: AccountNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen name="Account" options={{ title: 'Account' }}>
        {() => (
          <AccountScreen
            colors={colors}
            disabled={auth.busy || addWeight.submitting}
            loading={auth.signingOut}
            notice={auth.notice}
            onSignOut={auth.signOut}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
