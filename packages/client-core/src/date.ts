const API_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function formatApiDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isApiDate(value: string): boolean {
  const match = API_DATE_PATTERN.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  return (
    year !== 0 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isApiDateRangeValid(from?: string, to?: string): boolean {
  return !from || !to || from <= to;
}
