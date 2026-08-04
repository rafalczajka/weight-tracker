import { isApiDate, isApiDateRangeValid } from '@weight-tracker/client-core';

export function formatPickerDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseApiDate(value: string): Date {
  if (!isApiDate(value)) {
    return new Date();
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));

  return new Date(year, month - 1, day, 12);
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
  return isApiDateRangeValid(from, to)
    ? null
    : 'Start date must be before or equal to end date.';
}
