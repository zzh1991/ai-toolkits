// src/db/index.ts
import Dexie, { type EntityTable } from 'dexie';
import type { Reminder } from './schema';

const db = new Dexie('ReminderDatabase') as Dexie & {
  reminders: EntityTable<Reminder, 'id'>;
};

db.version(1).stores({
  reminders: '++id, title, date, dateType, isRepeating, color, createdAt',
});

export { db };
