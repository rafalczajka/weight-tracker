import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { createStackScreenOptions } from '../../navigation/options';
import type { ThemeColors } from '../../theme';
import { ScanScreen } from './ScanScreen';

export type ScanStackParamList = {
  Scanner: undefined;
};

const Stack = createNativeStackNavigator<ScanStackParamList>();

interface ScanNavigatorProps {
  colors: ThemeColors;
}

export function ScanNavigator({ colors }: ScanNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen name="Scanner" options={{ title: 'Scan' }}>
        {() => <ScanScreen colors={colors} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
