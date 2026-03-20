// src/modules/reminder/stores/reminderStore.ts
import { create } from 'zustand';
import type { Reminder, ReminderWithDays } from '@/db/schema';
import {
  getAllReminders,
  addReminder as addReminderDb,
  updateReminder as updateReminderDb,
  deleteReminder as deleteReminderDb,
} from '@/db/stores/reminderStore';
import { calculateDays } from '@/shared/lib/utils';

interface ReminderState {
  reminders: ReminderWithDays[];
  isLoading: boolean;
  error: string | null;
  fetchReminders: () => Promise<void>;
  addReminder: (reminder: Omit<Reminder, 'id'>) => Promise<void>;
  updateReminder: (id: number, changes: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: number) => Promise<void>;
  getUpcomingReminders: () => ReminderWithDays[];
  getPastReminders: () => ReminderWithDays[];
}

function processReminders(reminders: Reminder[]): ReminderWithDays[] {
  return reminders
    .map((reminder) => ({
      ...reminder,
      days: calculateDays(reminder),
    }))
    .sort((a, b) => Math.abs(a.days) - Math.abs(b.days));
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  isLoading: false,
  error: null,

  fetchReminders: async () => {
    set({ isLoading: true, error: null });
    try {
      const reminders = await getAllReminders();
      set({ reminders: processReminders(reminders), isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch reminders', isLoading: false });
    }
  },

  addReminder: async (reminder) => {
    try {
      // Optimistic update: 直接添加并显示
      const tempId = Date.now(); // 临时 ID
      const newReminder = { ...reminder, id: tempId };
      const currentReminders = get().reminders;
      set({ reminders: processReminders([...currentReminders, newReminder as Reminder]) });

      // 后台保存到数据库
      const id = await addReminderDb(reminder);
      // 更新为真实 ID
      const finalReminders = get().reminders.map(r => r.id === tempId ? { ...r, id } as Reminder : r);
      set({ reminders: processReminders(finalReminders) });
    } catch (error) {
      set({ error: 'Failed to add reminder' });
      // 回滚：重新获取数据
      await get().fetchReminders();
    }
  },

  updateReminder: async (id, changes) => {
    try {
      // Optimistic update: 立即更新本地状态
      const currentReminders = get().reminders;
      const updatedReminders = currentReminders.map((r) =>
        r.id === id ? { ...r, ...changes } as ReminderWithDays : r
      );
      // 重新处理所有提醒以更新天数和排序
      set({ reminders: processReminders(updatedReminders.map(r => ({ ...r, days: undefined } as unknown as Reminder))) });

      // 后台更新数据库
      await updateReminderDb(id, changes);
    } catch (error) {
      set({ error: 'Failed to update reminder' });
      // 回滚
      await get().fetchReminders();
    }
  },

  deleteReminder: async (id) => {
    try {
      // Optimistic update: 立即从本地状态移除
      const currentReminders = get().reminders;
      set({ reminders: currentReminders.filter((r) => r.id !== id) });

      // 后台删除数据库记录
      await deleteReminderDb(id);
    } catch (error) {
      set({ error: 'Failed to delete reminder' });
      // 回滚
      await get().fetchReminders();
    }
  },

  getUpcomingReminders: () => {
    return get().reminders.filter((r) => r.days >= 0);
  },

  getPastReminders: () => {
    return get().reminders.filter((r) => r.days < 0);
  },
}));
