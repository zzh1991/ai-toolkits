// src/db/schema.ts
export interface Reminder {
  id?: number;
  title: string;
  date: string;
  dateType: 'solar' | 'lunar';
  isRepeating: boolean;
  color: string;
  createdAt: Date;
}

export interface ReminderWithDays extends Reminder {
  days: number;
}
