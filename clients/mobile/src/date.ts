const API_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function getTodayApiDate(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function formatPickerDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseApiDate(value: string): Date {
  const match = API_DATE_PATTERN.exec(value);

  if (!match) {
    return new Date();
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
}

export function formatDisplayDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(date);
}

export function getDateRangeError(from?: string, to?: string): string | null {
  return from && to && from > to
    ? 'Start date must be before or equal to end date.'
    : null;
}
