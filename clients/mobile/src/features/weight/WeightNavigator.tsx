import { useNavigation, useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import React from 'react';
import type { AuthSessionController } from '../../auth';
import { IconButton } from '../../components';
import { createStackScreenOptions } from '../../navigation/options';
import type { ThemeColors } from '../../theme';
import { AddWeightScreen } from './screens/AddWeightScreen';
import { EditWeightScreen } from './screens/EditWeightScreen';
import { WeightDetailsScreen } from './screens/WeightDetailsScreen';
import { WeightHistoryScreen } from './screens/WeightHistoryScreen';

export type WeightStackParamList = {
  WeightHistory: { initialNotice?: string } | undefined;
  AddWeight: { date?: string } | undefined;
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
}

export function WeightNavigator({ auth, colors }: WeightNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen
        name="WeightHistory"
        options={{ headerRight: AddWeightHeaderButton, title: 'Weight' }}
      >
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
            onCreated={entry =>
              navigation.replace('WeightDetails', {
                date: entry.date,
                initialNotice: 'Weight added.',
              })
            }
            onViewExisting={date =>
              navigation.replace('WeightDetails', { date })
            }
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
              navigation.navigate('WeightDetails', {
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

function AddWeightHeaderButton() {
  const navigation =
    useNavigation<NativeStackNavigationProp<WeightStackParamList>>();
  const { colors } = useTheme();

  return (
    <IconButton
      accessibilityLabel="Add weight"
      onPress={() => navigation.navigate('AddWeight')}
    >
      <Plus color={colors.text} size={22} strokeWidth={2} />
    </IconButton>
  );
}
