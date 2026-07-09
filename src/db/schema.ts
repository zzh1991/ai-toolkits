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

// 四象限任务类型
export type QuadrantType = 'important-urgent' | 'important-not-urgent' | 'not-important-urgent' | 'not-important-not-urgent';

export interface Task {
  id?: number;
  title: string;
  note?: string;
  deadline?: Date;
  createdAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
  quadrant: QuadrantType;
}

// 停车记录类型
export interface ParkingRecord {
  id?: number;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface ParkingRecordWithDuration extends ParkingRecord {
  duration: number; // 毫秒
}

// 英语词汇
export type VocabLevel =
  | 'kindergarten'
  | 'grade1'
  | 'grade2'
  | 'grade3'
  | 'grade4'
  | 'grade5'
  | 'grade6';

export type VocabCategory =
  | 'animals'
  | 'food'
  | 'colors'
  | 'numbers'
  | 'body'
  | 'family'
  | 'school'
  | 'clothes'
  | 'weather'
  | 'home'
  | 'actions'
  | 'nature'
  | 'transport'
  | 'emotions'
  | 'time';

export interface WordEntry {
  id?: number;
  english: string;
  chinese: string;
  synonyms: string; // 以逗号分隔存储，方便搜索
  level: VocabLevel;
  category: VocabCategory;
}
