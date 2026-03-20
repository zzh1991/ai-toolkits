// src/shared/lib/lunar.ts
import { Lunar, Solar } from 'lunar-typescript';

export function lunarToSolar(lunarDateStr: string): Date {
  const [year, month, day] = lunarDateStr.split('-').map(Number);
  const lunar = Lunar.fromYmd(year, month, day);
  const solar = lunar.getSolar();
  return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
}

export function solarToLunar(date: Date): { year: number; month: number; day: number } {
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const lunar = solar.getLunar();
  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
  };
}

export function formatLunarDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const lunar = Lunar.fromYmd(year, month, day);
  return lunar.toString();
}

export function getLunarDateString(date: Date): string {
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const lunar = solar.getLunar();
  return `${lunar.getYear()}-${String(lunar.getMonth()).padStart(2, '0')}-${String(lunar.getDay()).padStart(2, '0')}`;
}
