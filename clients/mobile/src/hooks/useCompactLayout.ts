import { useWindowDimensions } from 'react-native';

export function isCompactLayout(width: number, fontScale: number) {
  return width < 360 || fontScale >= 1.3;
}

export function useCompactLayout() {
  const { fontScale, width } = useWindowDimensions();
  return isCompactLayout(width, fontScale);
}
