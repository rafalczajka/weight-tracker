import { InvalidArgumentError } from 'commander';
import { MAX_WEIGHT_KG } from './constants';

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDate(value: string): string {
  const match = DATE_PATTERN.exec(value);

  if (!match) {
    throw new InvalidArgumentError('Date must be in YYYY-MM-DD format.');
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  if (
    year === 0 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new InvalidArgumentError('Date must be in YYYY-MM-DD format.');
  }

  return value;
}

export function parseWeightKg(value: string): number {
  const weightKg = Number(value);

  if (
    !value.trim() ||
    !Number.isFinite(weightKg) ||
    weightKg <= 0 ||
    weightKg > MAX_WEIGHT_KG
  ) {
    throw new InvalidArgumentError(
      `Weight must be a number greater than 0 and at most ${MAX_WEIGHT_KG} kg.`,
    );
  }

  return weightKg;
}

export function parseTail(value: string): number {
  const tail = Number(value);

  if (!/^-?\d+$/.test(value) || !Number.isSafeInteger(tail)) {
    throw new InvalidArgumentError('Tail must be an integer.');
  }

  return Math.max(0, tail);
}

export function parseMovingAverageDays(value: string): number {
  const windowDays = Number(value);

  if (
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(windowDays) ||
    windowDays <= 0
  ) {
    throw new InvalidArgumentError(
      'Moving average days must be a positive integer.',
    );
  }

  return windowDays;
}

export function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
