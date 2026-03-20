// src/db/stores/reminderStore.ts
import { db } from '../index';
import type { Reminder } from '../schema';

export async function getAllReminders(): Promise<Reminder[]> {
  return db.reminders.toArray();
}

export async function addReminder(reminder: Omit<Reminder, 'id'>): Promise<number | undefined> {
  return db.reminders.add(reminder);
}

export async function updateReminder(id: number, changes: Partial<Reminder>): Promise<void> {
  await db.reminders.update(id, changes);
}

export async function deleteReminder(id: number): Promise<void> {
  await db.reminders.delete(id);
}

export async function getReminderById(id: number): Promise<Reminder | undefined> {
  return db.reminders.get(id);
}
