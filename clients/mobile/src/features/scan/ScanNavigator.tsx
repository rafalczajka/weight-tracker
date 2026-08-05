import type { Product } from '@weight-tracker/api-client';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { createStackScreenOptions } from '@/navigation/options';
import type { ThemeColors } from '@/theme';
import { AddProductCaloriesScreen } from './screens/AddProductCaloriesScreen';
import { ManualBarcodeScreen } from './screens/ManualBarcodeScreen';
import { ProductDetailsScreen } from './screens/ProductDetailsScreen';
import { ScannerScreen } from './screens/ScannerScreen';

export type ScanStackParamList = {
  Scanner: undefined;
  ManualBarcode: undefined;
  ProductDetails: { product: Product };
  AddProductCalories: { product: Product };
};

const Stack = createNativeStackNavigator<ScanStackParamList>();

interface ScanNavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onAddCaloriesManually: (description?: string) => void;
  onCaloriesAdded: (date: string) => void;
}

export function ScanNavigator({
  auth,
  colors,
  onAddCaloriesManually,
  onCaloriesAdded,
}: ScanNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen name="Scanner" options={{ title: 'Scan' }}>
        {({ navigation }) => (
          <ScannerScreen
            auth={auth}
            colors={colors}
            onEnterManually={() => navigation.navigate('ManualBarcode')}
            onProductFound={product =>
              navigation.navigate('ProductDetails', { product })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ManualBarcode" options={{ title: 'Enter Barcode' }}>
        {({ navigation }) => (
          <ManualBarcodeScreen
            auth={auth}
            colors={colors}
            onProductFound={product =>
              navigation.navigate('ProductDetails', { product })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ProductDetails" options={{ title: 'Product' }}>
        {({ navigation, route }) => (
          <ProductDetailsScreen
            colors={colors}
            onAddCalories={() =>
              navigation.navigate('AddProductCalories', {
                product: route.params.product,
              })
            }
            onAddManually={() => {
              navigation.popToTop();
              onAddCaloriesManually(route.params.product.name ?? undefined);
            }}
            onScanAnother={() => navigation.popToTop()}
            product={route.params.product}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="AddProductCalories"
        options={{ title: 'Add Calories' }}
      >
        {({ navigation, route }) => (
          <AddProductCaloriesScreen
            auth={auth}
            colors={colors}
            onAddManually={() => {
              navigation.popToTop();
              onAddCaloriesManually(route.params.product.name ?? undefined);
            }}
            onCreated={date => {
              navigation.popToTop();
              onCaloriesAdded(date);
            }}
            product={route.params.product}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
