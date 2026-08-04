import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { AuthSessionController } from '../../auth';
import { createStackScreenOptions } from '../../navigation/options';
import type { ThemeColors } from '../../theme';
import { HomeScreen } from './HomeScreen';

export type HomeStackParamList = {
  HomeOverview: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

interface HomeNavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onAddCalories: (date: string) => void;
  onAddWeight: (date: string) => void;
  onOpenCalories: (date: string) => void;
  onEditWeight: (date: string, weightKg: number) => void;
  onScanProduct: () => void;
}

export function HomeNavigator(props: HomeNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(props.colors)}>
      <Stack.Screen name="HomeOverview" options={{ title: 'Home' }}>
        {() => <HomeScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
