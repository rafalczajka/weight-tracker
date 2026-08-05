import { useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { IconButton } from '@/components';
import type { CalculatorRouteName } from '@/features/calculations';
import { createStackScreenOptions } from '@/navigation/options';
import type { ThemeColors } from '@/theme';
import { AddWeightScreen } from './screens/AddWeightScreen';
import { EditWeightScreen } from './screens/EditWeightScreen';
import { WeightDetailsScreen } from './screens/WeightDetailsScreen';
import { WeightHistoryScreen } from './screens/WeightHistoryScreen';

export type WeightStackParamList = {
  WeightHistory: { initialNotice?: string } | undefined;
  AddWeight:
    | { date?: string; returnToCalculator?: CalculatorRouteName }
    | undefined;
  WeightDetails: {
    date: string;
    initialNotice?: string;
    previousWeightKg?: number;
  };
  EditWeight: { date: string; weightKg: number };
};

const Stack = createNativeStackNavigator<WeightStackParamList>();

interface WeightNavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onReturnToCalculator: (calculator: CalculatorRouteName) => void;
}

export function WeightNavigator({
  auth,
  colors,
  onReturnToCalculator,
}: WeightNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen name="WeightHistory" options={weightHistoryOptions}>
        {({ navigation, route }) => (
          <WeightHistoryScreen
            auth={auth}
            colors={colors}
            initialNotice={route.params?.initialNotice}
            onAddWeight={() => navigation.navigate('AddWeight')}
            onOpenEntry={(entry, previousWeightKg) =>
              navigation.navigate('WeightDetails', {
                date: entry.date,
                previousWeightKg,
              })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddWeight" options={{ title: 'Add Weight' }}>
        {({ navigation, route }) => (
          <AddWeightScreen
            auth={auth}
            colors={colors}
            initialDate={route.params?.date}
            onCreated={entry => {
              if (route.params?.returnToCalculator) {
                navigation.popTo('WeightHistory', {
                  initialNotice: 'Weight added.',
                });
                onReturnToCalculator(route.params.returnToCalculator);
                return;
              }

              navigation.popTo('WeightDetails', {
                date: entry.date,
                initialNotice: 'Weight added.',
              });
            }}
            onViewExisting={date => navigation.popTo('WeightDetails', { date })}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="WeightDetails" options={{ title: 'Weight Details' }}>
        {({ navigation, route }) => (
          <WeightDetailsScreen
            auth={auth}
            colors={colors}
            date={route.params.date}
            initialNotice={route.params.initialNotice}
            previousWeightKg={route.params.previousWeightKg}
            onDeleted={() =>
              navigation.popTo('WeightHistory', {
                initialNotice: 'Weight entry deleted.',
              })
            }
            onEdit={entry =>
              navigation.navigate('EditWeight', {
                date: entry.date,
                weightKg: entry.weightKg,
              })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="EditWeight" options={{ title: 'Edit Weight' }}>
        {({ navigation, route }) => (
          <EditWeightScreen
            auth={auth}
            colors={colors}
            entry={route.params}
            onSaved={entry =>
              navigation.popTo('WeightDetails', {
                date: entry.date,
                initialNotice: 'Weight updated.',
              })
            }
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function weightHistoryOptions({
  navigation,
}: {
  navigation: NativeStackNavigationProp<WeightStackParamList, 'WeightHistory'>;
}): NativeStackNavigationOptions {
  return {
    headerRight: () => (
      <AddWeightHeaderButton onPress={() => navigation.navigate('AddWeight')} />
    ),
    title: 'Weight',
  };
}

function AddWeightHeaderButton({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();

  return (
    <IconButton accessibilityLabel="Add weight" onPress={onPress}>
      <Plus color={colors.text} size={22} strokeWidth={2} />
    </IconButton>
  );
}
