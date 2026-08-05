import type { NutritionFacts, Product } from '@weight-tracker/api-client';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ListRow, PrimaryButton, Screen, TextButton } from '@/components';
import { formatCaloriesKcal } from '@/format';
import type { ThemeColors } from '@/theme';
import { getProductCalorieSources } from '../productCalories';
import { CollapsibleSection } from './CollapsibleSection';
import { NutritionFactsList } from './NutritionFactsList';

interface ProductDetailsContentProps {
  colors: ThemeColors;
  onAddCalories: () => void;
  onAddManually: () => void;
  onScanAnother: () => void;
  product: Product;
}

export function ProductDetailsContent({
  colors,
  onAddCalories,
  onAddManually,
  onScanAnother,
  product,
}: ProductDetailsContentProps) {
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const canCalculateCalories = getProductCalorieSources(product).length > 0;
  const perServing = product.nutrition?.perServing;
  const per100 = product.nutrition?.per100;
  const hasNutrition = Boolean(perServing || per100);

  return (
    <Screen>
      {product.imageUrl && !imageUnavailable ? (
        <Image
          accessibilityLabel={`${product.name ?? 'Product'} image`}
          onError={() => setImageUnavailable(true)}
          resizeMode="contain"
          source={{ uri: product.imageUrl }}
          style={[styles.image, { backgroundColor: colors.input }]}
        />
      ) : (
        <View style={[styles.imagePlaceholder, { borderColor: colors.border }]}>
          <Text style={[styles.placeholderText, { color: colors.muted }]}>
            No image
          </Text>
        </View>
      )}

      <Text style={[styles.name, { color: colors.text }]}>
        {product.name ?? 'Unknown product'}
      </Text>

      <View style={[styles.summary, { borderTopColor: colors.border }]}>
        <ListRow colors={colors} title="Barcode" value={product.code} />
        {product.quantity ? (
          <ListRow colors={colors} title="Quantity" value={product.quantity} />
        ) : null}
        {product.servingSize ? (
          <ListRow
            colors={colors}
            title="Serving size"
            value={product.servingSize}
          />
        ) : null}
        {perServing?.energyKcal != null ? (
          <ListRow
            colors={colors}
            title="Calories per serving"
            value={formatCaloriesKcal(perServing.energyKcal)}
          />
        ) : null}
        {per100?.energyKcal != null ? (
          <ListRow
            colors={colors}
            title={formatReference('Calories per', per100)}
            value={formatCaloriesKcal(per100.energyKcal)}
          />
        ) : null}
      </View>

      <PrimaryButton
        colors={colors}
        disabled={false}
        label={canCalculateCalories ? 'Add calories' : 'Add calories manually'}
        loading={false}
        onPress={canCalculateCalories ? onAddCalories : onAddManually}
        style={styles.primaryAction}
      />

      <CollapsibleSection colors={colors} title="Nutrition facts">
        {hasNutrition ? (
          <>
            {perServing ? (
              <NutritionFactsList
                colors={colors}
                facts={perServing}
                title={formatReference('Per serving', perServing)}
              />
            ) : null}
            {per100 ? (
              <NutritionFactsList
                colors={colors}
                facts={per100}
                title={formatReference('Per', per100)}
              />
            ) : null}
          </>
        ) : (
          <Text style={[styles.unavailable, { color: colors.muted }]}>
            Nutrition information is unavailable.
          </Text>
        )}
      </CollapsibleSection>

      <CollapsibleSection colors={colors} title="Ingredients">
        <Text style={[styles.ingredients, { color: colors.text }]}>
          {product.ingredients ?? 'Ingredient information is unavailable.'}
        </Text>
      </CollapsibleSection>

      <TextButton
        colors={colors}
        label="Scan another product"
        onPress={onScanAnother}
        style={styles.secondaryAction}
      />
    </Screen>
  );
}

function formatReference(prefix: string, facts: NutritionFacts): string {
  if (facts.referenceAmount && facts.referenceUnit) {
    return `${prefix} ${facts.referenceAmount.toLocaleString()} ${
      facts.referenceUnit
    }`;
  }

  return prefix;
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    height: 220,
    width: 220,
  },
  imagePlaceholder: {
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    height: 180,
    justifyContent: 'center',
    width: 180,
  },
  ingredients: {
    fontSize: 15,
    letterSpacing: 0,
    lineHeight: 22,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 30,
    marginTop: 20,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    letterSpacing: 0,
  },
  primaryAction: {
    marginBottom: 24,
    marginTop: 24,
  },
  secondaryAction: {
    alignSelf: 'center',
    marginTop: 12,
  },
  summary: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 24,
  },
  unavailable: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
  },
});
