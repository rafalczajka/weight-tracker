import { isCompactLayout } from '../src/hooks/useCompactLayout';

test.each([
  [320, 1, true],
  [359, 1, true],
  [360, 1, false],
  [400, 1.29, false],
  [400, 1.3, true],
])(
  'selects compact history rows at width %d and font scale %d',
  (width, fontScale, expected) => {
    expect(isCompactLayout(width, fontScale)).toBe(expected);
  },
);
