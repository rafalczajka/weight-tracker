import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { createStackScreenOptions } from '../../navigation/options';
import type { ThemeColors } from '../../theme';
import { CaloriesScreen } from './CaloriesScreen';

type CaloriesStackParamList = {
  Calories: undefined;
};

const Stack = createNativeStackNavigator<CaloriesStackParamList>();

interface CaloriesNavigatorProps {
  colors: ThemeColors;
}

export function CaloriesNavigator({ colors }: CaloriesNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen name="Calories" options={{ title: 'Calories' }}>
        {() => <CaloriesScreen colors={colors} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
