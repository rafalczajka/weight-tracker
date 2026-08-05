import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import type { CalculatorRouteName } from '@/features/calculations';
import { createStackScreenOptions } from '@/navigation/options';
import type { ThemeColors } from '@/theme';
import { AccountScreen } from './screens/AccountScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';

export type AccountStackParamList = {
  AccountOverview: { initialNotice?: string } | undefined;
  EditProfile: { returnToCalculator?: CalculatorRouteName } | undefined;
};

const Stack = createNativeStackNavigator<AccountStackParamList>();

interface AccountNavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onReturnToCalculator: (calculator: CalculatorRouteName) => void;
}

export function AccountNavigator({
  auth,
  colors,
  onReturnToCalculator,
}: AccountNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen name="AccountOverview" options={{ title: 'Account' }}>
        {({ navigation, route }) => (
          <AccountScreen
            auth={auth}
            colors={colors}
            initialNotice={route.params?.initialNotice}
            onEdit={() => navigation.navigate('EditProfile')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="EditProfile" options={{ title: 'Edit Profile' }}>
        {({ navigation, route }) => (
          <EditProfileScreen
            auth={auth}
            colors={colors}
            onSaved={message => {
              navigation.popTo('AccountOverview', { initialNotice: message });

              if (route.params?.returnToCalculator) {
                onReturnToCalculator(route.params.returnToCalculator);
              }
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
