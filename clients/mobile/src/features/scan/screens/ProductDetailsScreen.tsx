import type { Product } from '@weight-tracker/api-client';
import React from 'react';
import type { ThemeColors } from '@/theme';
import { ProductDetailsContent } from '../components/ProductDetailsContent';

interface ProductDetailsScreenProps {
  colors: ThemeColors;
  onAddCalories: () => void;
  onAddManually: () => void;
  onScanAnother: () => void;
  product: Product;
}

export function ProductDetailsScreen(props: ProductDetailsScreenProps) {
  return <ProductDetailsContent {...props} />;
}
