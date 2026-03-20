// src/shared/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Solar, Lunar } from 'lunar-typescript';
import { lunarToSolar } from './lunar';
import type { Reminder } from '@/db/schema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDays(reminder: Reminder): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let targetDate: Date;

  if (reminder.dateType === 'lunar') {
    targetDate = lunarToSolar(reminder.date);
  } else {
    const [year, month, day] = reminder.date.split('-').map(Number);
    targetDate = new Date(year, month - 1, day);
  }

  targetDate.setHours(0, 0, 0, 0);

  if (reminder.isRepeating) {
    targetDate = getNextOccurrence(targetDate, today, reminder.dateType === 'lunar');
  }

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

function getNextOccurrence(targetDate: Date, today: Date, isLunar: boolean): Date {
  const currentYear = today.getFullYear();

  if (isLunar) {
    // For lunar dates, we need to find the next lunar occurrence
    const lunarDateStr = getLunarDateStringForYear(targetDate, currentYear);
    let nextDate = lunarToSolar(lunarDateStr);

    if (nextDate < today) {
      // Try next year
      const nextYearLunarStr = getLunarDateStringForYear(targetDate, currentYear + 1);
      nextDate = lunarToSolar(nextYearLunarStr);
    }

    return nextDate;
  } else {
    // For solar dates
    const [_, month, day] = targetDate.toISOString().split('T')[0].split('-').map(Number);
    let nextDate = new Date(currentYear, month - 1, day);

    if (nextDate < today) {
      nextDate = new Date(currentYear + 1, month - 1, day);
    }

    return nextDate;
  }
}

function getLunarDateStringForYear(originalDate: Date, year: number): string {
  // Convert the original solar date to lunar to get month/day
  const originalSolar = Solar.fromYmd(
    originalDate.getFullYear(),
    originalDate.getMonth() + 1,
    originalDate.getDate()
  );
  const lunar = originalSolar.getLunar();
  // Return the lunar date string for the target year
  return `${year}-${String(lunar.getMonth()).padStart(2, '0')}-${String(lunar.getDay()).padStart(2, '0')}`;
}

export function formatDateDisplay(dateStr: string, dateType: 'solar' | 'lunar'): string {
  if (dateType === 'solar') {
    const [year, month, day] = dateStr.split('-');
    return `${year}年${month}月${day}日`;
  } else {
    const [year, month, day] = dateStr.split('-').map(Number);
    const lunar = Lunar.fromYmd(year, month, day);
    return lunar.toString();
  }
}

export function getTodayString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}
