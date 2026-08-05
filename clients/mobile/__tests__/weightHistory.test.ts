import { createWeightHistoryRows } from '../src/features/weight/history';

test('sorts weight entries newest first and compares each with the prior measurement', () => {
  const rows = createWeightHistoryRows([
    { date: '2026-08-01', weightKg: 80 },
    { date: '2026-08-03', weightKg: 79 },
    { date: '2026-08-02', weightKg: 81 },
  ]);

  expect(rows).toEqual([
    {
      changeKg: -2,
      entry: { date: '2026-08-03', weightKg: 79 },
      previousWeightKg: 81,
    },
    {
      changeKg: 1,
      entry: { date: '2026-08-02', weightKg: 81 },
      previousWeightKg: 80,
    },
    {
      entry: { date: '2026-08-01', weightKg: 80 },
    },
  ]);
});

test('does not modify the API response order', () => {
  const entries = [
    { date: '2026-08-01', weightKg: 80 },
    { date: '2026-08-02', weightKg: 79 },
  ];

  createWeightHistoryRows(entries);

  expect(entries.map(entry => entry.date)).toEqual([
    '2026-08-01',
    '2026-08-02',
  ]);
});
