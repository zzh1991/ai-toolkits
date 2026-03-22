// src/modules/kanban/types/task.ts
import type { Task, QuadrantType } from '@/db/schema';

export type { Task, QuadrantType };

export interface TaskFormData {
  title: string;
  note?: string;
  deadline?: Date;
  quadrant: QuadrantType;
}

export interface TaskGroup {
  uncompleted: Task[];
  completed: Task[];
}

export const QUADRANT_LABELS: Record<QuadrantType, string> = {
  'important-urgent': '重要且紧急',
  'important-not-urgent': '重要不紧急',
  'not-important-urgent': '紧急不重要',
  'not-important-not-urgent': '不重要不紧急',
};

export const QUADRANT_COLORS: Record<QuadrantType, { bg: string; border: string; header: string }> = {
  'important-urgent': {
    bg: 'bg-red-50/80 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    header: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200',
  },
  'important-not-urgent': {
    bg: 'bg-blue-50/80 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    header: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
  },
  'not-important-urgent': {
    bg: 'bg-amber-50/80 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    header: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200',
  },
  'not-important-not-urgent': {
    bg: 'bg-gray-50/80 dark:bg-gray-900/30',
    border: 'border-gray-200 dark:border-gray-700',
    header: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  },
};
