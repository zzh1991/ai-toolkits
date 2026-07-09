// src/db/index.ts
import Dexie, { type EntityTable } from 'dexie';
import type { Reminder, Task, ParkingRecord, WordEntry } from './schema';

const db = new Dexie('ReminderDatabase') as Dexie & {
  reminders: EntityTable<Reminder, 'id'>;
  tasks: EntityTable<Task, 'id'>;
  parkingRecords: EntityTable<ParkingRecord, 'id'>;
  wordEntries: EntityTable<WordEntry, 'id'>;
};

db.version(1).stores({
  reminders: '++id, title, date, dateType, isRepeating, color, createdAt',
  tasks: '++id, title, deadline, createdAt, completedAt, isCompleted, quadrant',
  parkingRecords: '++id, startTime, endTime, isActive, createdAt',
  wordEntries: '++id, english, chinese, synonyms, level, category',
});

export { db };
