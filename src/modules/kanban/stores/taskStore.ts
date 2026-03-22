// src/modules/kanban/stores/taskStore.ts
import { create } from 'zustand';
import {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  getTasksStats,
  getQuadrantStats,
} from '@/db/stores/taskStore';
import type { Task, QuadrantType } from '@/db/schema';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  stats: {
    total: number;
    completed: number;
    uncompleted: number;
    todayDue: number;
  };
  quadrantStats: Record<QuadrantType, {
    total: number;
    completed: number;
    uncompleted: number;
    todayDue: number;
  }>;
}

interface TaskActions {
  fetchTasks: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: number, changes: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleComplete: (id: number, isCompleted: boolean) => Promise<void>;
}

const initialQuadrantStats = {
  total: 0,
  completed: 0,
  uncompleted: 0,
  todayDue: 0,
};

export const useTaskStore = create<TaskState & TaskActions>((set, get) => ({
  tasks: [],
  isLoading: false,
  stats: {
    total: 0,
    completed: 0,
    uncompleted: 0,
    todayDue: 0,
  },
  quadrantStats: {
    'important-urgent': { ...initialQuadrantStats },
    'important-not-urgent': { ...initialQuadrantStats },
    'not-important-urgent': { ...initialQuadrantStats },
    'not-important-not-urgent': { ...initialQuadrantStats },
  },

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchStats: async () => {
    try {
      const stats = await getTasksStats();
      const quadrantStats = {
        'important-urgent': await getQuadrantStats('important-urgent'),
        'important-not-urgent': await getQuadrantStats('important-not-urgent'),
        'not-important-urgent': await getQuadrantStats('not-important-urgent'),
        'not-important-not-urgent': await getQuadrantStats('not-important-not-urgent'),
      };
      set({ stats, quadrantStats });
    } catch (error) {
      throw error;
    }
  },

  addTask: async (task) => {
    await addTask(task);
    await get().fetchTasks();
    await get().fetchStats();
  },

  updateTask: async (id, changes) => {
    await updateTask(id, changes);
    await get().fetchTasks();
    await get().fetchStats();
  },

  deleteTask: async (id) => {
    await deleteTask(id);
    await get().fetchTasks();
    await get().fetchStats();
  },

  toggleComplete: async (id, isCompleted) => {
    await toggleTaskComplete(id, isCompleted);
    await get().fetchTasks();
    await get().fetchStats();
  },
}));

// Selector functions
export const selectTasksByQuadrant = (state: TaskState, quadrant: QuadrantType) => {
  return state.tasks.filter((task) => task.quadrant === quadrant);
};
