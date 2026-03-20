// src/modules/reminder/types/reminder.ts
import type { Reminder, ReminderWithDays } from '@/db/schema';

export interface ReminderFormData {
  title: string;
  date: string;
  dateType: 'solar' | 'lunar';
  isRepeating: boolean;
  color: string;
}

export interface ReminderCardProps {
  reminder: ReminderWithDays;
  onEdit: () => void;
  onDelete: () => void;
}

export interface ReminderFormProps {
  reminder?: Reminder;
  onSubmit: (data: ReminderFormData) => void;
  onCancel: () => void;
}

export interface ReminderListProps {
  reminders: ReminderWithDays[];
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: number) => void;
}
