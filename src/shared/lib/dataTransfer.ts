// src/shared/lib/dataTransfer.ts
import type { Reminder, Task, ParkingRecord } from '@/db/schema';
import { getAllReminders, addReminder } from '@/db/stores/reminderStore';
import { getAllTasks, addTask } from '@/db/stores/taskStore';
import { getParkingHistory, getActiveParking } from '@/db/stores/parkingStore';

// 应用数据导出格式
export interface AppDataExport {
  version: string;
  exportDate: string;
  reminders: Reminder[];
  tasks: Task[];
  parkingRecords: ParkingRecord[];
}

// 导入结果统计
export interface ImportResult {
  reminders: { added: number; skipped: number };
  tasks: { added: number; skipped: number };
  parkingRecords: { added: number; skipped: number };
}

/**
 * 导出所有应用数据
 */
export async function exportAllData(): Promise<AppDataExport> {
  const [reminders, tasks, parkingHistory, activeParking] = await Promise.all([
    getAllReminders(),
    getAllTasks(),
    getParkingHistory(),
    getActiveParking(),
  ]);

  const parkingRecords = activeParking
    ? [...parkingHistory, activeParking]
    : parkingHistory;

  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    reminders,
    tasks,
    parkingRecords,
  };
}

/**
 * 下载数据为 JSON 文件
 */
export function downloadDataAsFile(data: AppDataExport, filename?: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const date = new Date().toISOString().split('T')[0];
  link.download = filename || `ai-toolkits-backup-${date}.json`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 从文件读取数据
 */
export function readDataFromFile(file: File): Promise<AppDataExport> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as AppDataExport;
        resolve(data);
      } catch (error) {
        reject(new Error('文件格式错误，无法解析 JSON'));
      }
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsText(file);
  });
}

/**
 * 检查提醒是否重复（根据 title + date + dateType）
 */
function isReminderDuplicate(existing: Reminder[], newReminder: Reminder): boolean {
  return existing.some(
    (r) =>
      r.title === newReminder.title &&
      r.date === newReminder.date &&
      r.dateType === newReminder.dateType
  );
}

/**
 * 检查任务是否重复（根据 title + quadrant + deadline）
 */
function isTaskDuplicate(existing: Task[], newTask: Task): boolean {
  return existing.some(
    (t) =>
      t.title === newTask.title &&
      t.quadrant === newTask.quadrant &&
      ((!t.deadline && !newTask.deadline) ||
        (t.deadline &&
          newTask.deadline &&
          new Date(t.deadline).getTime() === new Date(newTask.deadline).getTime()))
  );
}

/**
 * 检查停车记录是否重复（根据 startTime）
 */
function isParkingRecordDuplicate(
  existing: ParkingRecord[],
  newRecord: ParkingRecord
): boolean {
  return existing.some(
    (r) =>
      new Date(r.startTime).getTime() === new Date(newRecord.startTime).getTime()
  );
}

/**
 * 导入数据到应用
 * @param data 要导入的数据
 * @param options 导入选项
 * @returns 导入结果统计
 */
export async function importData(
  data: AppDataExport,
  options: {
    skipDuplicates?: boolean;
    onProgress?: (type: string, current: number, total: number) => void;
  } = {}
): Promise<ImportResult> {
  const { skipDuplicates = true, onProgress } = options;
  const result: ImportResult = {
    reminders: { added: 0, skipped: 0 },
    tasks: { added: 0, skipped: 0 },
    parkingRecords: { added: 0, skipped: 0 },
  };

  // 获取现有数据用于去重判断
  const [existingReminders, existingTasks, existingParking] = await Promise.all([
    getAllReminders(),
    getAllTasks(),
    getParkingHistory().then((h) => {
      return getActiveParking().then((a) => (a ? [...h, a] : h));
    }),
  ]);

  // 导入提醒
  if (data.reminders && data.reminders.length > 0) {
    for (let i = 0; i < data.reminders.length; i++) {
      const reminder = data.reminders[i];
      onProgress?.('reminders', i + 1, data.reminders.length);

      if (skipDuplicates && isReminderDuplicate(existingReminders, reminder)) {
        result.reminders.skipped++;
        continue;
      }

      try {
        await addReminder({
          title: reminder.title,
          date: reminder.date,
          dateType: reminder.dateType,
          isRepeating: reminder.isRepeating,
          color: reminder.color,
          createdAt: new Date(reminder.createdAt),
        });
        result.reminders.added++;
      } catch {
        result.reminders.skipped++;
      }
    }
  }

  // 导入任务
  if (data.tasks && data.tasks.length > 0) {
    for (let i = 0; i < data.tasks.length; i++) {
      const task = data.tasks[i];
      onProgress?.('tasks', i + 1, data.tasks.length);

      if (skipDuplicates && isTaskDuplicate(existingTasks, task)) {
        result.tasks.skipped++;
        continue;
      }

      try {
        await addTask({
          title: task.title,
          note: task.note,
          deadline: task.deadline ? new Date(task.deadline) : undefined,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          isCompleted: task.isCompleted,
          quadrant: task.quadrant,
        });
        result.tasks.added++;
      } catch {
        result.tasks.skipped++;
      }
    }
  }

  // 导入停车记录（跳过活跃的记录，只导入历史记录）
  if (data.parkingRecords && data.parkingRecords.length > 0) {
    const historyRecords = data.parkingRecords.filter((r) => !r.isActive);
    for (let i = 0; i < historyRecords.length; i++) {
      const record = historyRecords[i];
      onProgress?.('parkingRecords', i + 1, historyRecords.length);

      if (skipDuplicates && isParkingRecordDuplicate(existingParking, record)) {
        result.parkingRecords.skipped++;
        continue;
      }

      try {
        await addParkingRecord({
          startTime: new Date(record.startTime),
          endTime: record.endTime ? new Date(record.endTime) : undefined,
          isActive: false,
          createdAt: new Date(record.createdAt),
        });
        result.parkingRecords.added++;
      } catch {
        result.parkingRecords.skipped++;
      }
    }
  }

  return result;
}

// 添加停车记录到数据库的辅助函数
async function addParkingRecord(
  record: Omit<ParkingRecord, 'id'>
): Promise<number> {
  const { db } = await import('@/db');
  const id = await db.parkingRecords.add(record);
  if (id === undefined) {
    throw new Error('Failed to add parking record');
  }
  return id;
}
