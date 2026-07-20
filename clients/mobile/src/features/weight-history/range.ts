import type { WeightHistoryQuery } from '../../api';

export type WeightHistoryRange = '30d' | '90d' | 'all';

export function createHistoryQuery(
  range: WeightHistoryRange,
  today = new Date(),
): WeightHistoryQuery {
  if (range === 'all') {
    return {};
  }

  const days = range === '30d' ? 30 : 90;
  const from = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );

  from.setUTCDate(from.getUTCDate() - (days - 1));

  return {
    from: formatUtcDate(from),
    to: formatUtcDate(today),
  };
}

function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
