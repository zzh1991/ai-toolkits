// src/shared/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Lunar } from 'lunar-typescript';
import { lunarToSolar } from './lunar';
import type { Reminder } from '@/db/schema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDays(reminder: Reminder): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let targetDate: Date;

  try {
    if (reminder.dateType === 'lunar') {
      targetDate = lunarToSolar(reminder.date);
    } else {
      const [year, month, day] = reminder.date.split('-').map(Number);
      targetDate = new Date(year, month - 1, day);
    }
  } catch {
    // Invalid date (e.g., lunar 30th in a 29-day month)
    return 0;
  }

  targetDate.setHours(0, 0, 0, 0);

  if (reminder.isRepeating) {
    try {
      targetDate = getNextOccurrence(targetDate, today, reminder.dateType === 'lunar', reminder.date);
    } catch {
      // If next occurrence fails, use the original target date
    }
  }

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

function getNextOccurrence(targetDate: Date, today: Date, isLunar: boolean, originalDateStr: string): Date {
  const currentYear = today.getFullYear();

  if (isLunar) {
    // For lunar dates, the originalDateStr is "YYYY-MM-DD" in lunar calendar
    // We need to use the SAME lunar month/day for the target year
    const [, lunarMonth, lunarDay] = originalDateStr.split('-').map(Number);
    const lunarDateStr = `${currentYear}-${String(lunarMonth).padStart(2, '0')}-${String(lunarDay).padStart(2, '0')}`;
    let nextDate = lunarToSolar(lunarDateStr);

    if (nextDate < today) {
      // Try next year
      const nextYearLunarStr = `${currentYear + 1}-${String(lunarMonth).padStart(2, '0')}-${String(lunarDay).padStart(2, '0')}`;
      nextDate = lunarToSolar(nextYearLunarStr);
    }

    return nextDate;
  } else {
    // For solar dates, use the same month/day every year
    const [, month, day] = targetDate.toISOString().split('T')[0].split('-').map(Number);
    let nextDate = new Date(currentYear, month - 1, day);

    if (nextDate < today) {
      nextDate = new Date(currentYear + 1, month - 1, day);
    }

    return nextDate;
  }
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
