export function formatWeightKg(value: number): string {
  return `${formatDecimal(value)} kg`;
}

export function formatWeightChange(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${formatDecimal(value)} kg`;
}

export function formatCaloriesKcal(value: number): string {
  return `${Math.round(value).toLocaleString()} kcal`;
}

function formatDecimal(value: number): string {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}
