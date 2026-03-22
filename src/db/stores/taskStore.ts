// src/db/stores/taskStore.ts
import { db } from '../index';
import type { Task, QuadrantType } from '../schema';

export async function getAllTasks(): Promise<Task[]> {
  return db.tasks.toArray();
}

export async function getTasksByQuadrant(quadrant: QuadrantType): Promise<Task[]> {
  return db.tasks.where('quadrant').equals(quadrant).toArray();
}

export async function addTask(task: Omit<Task, 'id'>): Promise<number | undefined> {
  return db.tasks.add(task);
}

export async function updateTask(id: number, changes: Partial<Task>): Promise<void> {
  await db.tasks.update(id, changes);
}

export async function deleteTask(id: number): Promise<void> {
  await db.tasks.delete(id);
}

export async function toggleTaskComplete(id: number, isCompleted: boolean): Promise<void> {
  await db.tasks.update(id, {
    isCompleted,
    completedAt: isCompleted ? new Date() : undefined,
  });
}

export async function getTodayDueTasks(): Promise<Task[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return db.tasks
    .filter((task) => {
      if (!task.deadline || task.isCompleted) return false;
      const deadline = new Date(task.deadline);
      return deadline >= today && deadline < tomorrow;
    })
    .toArray();
}

export async function getTasksStats(): Promise<{
  total: number;
  completed: number;
  uncompleted: number;
  todayDue: number;
}> {
  const allTasks = await db.tasks.toArray();
  const todayDueTasks = await getTodayDueTasks();

  return {
    total: allTasks.length,
    completed: allTasks.filter((t) => t.isCompleted).length,
    uncompleted: allTasks.filter((t) => !t.isCompleted).length,
    todayDue: todayDueTasks.length,
  };
}

export async function getQuadrantStats(quadrant: QuadrantType): Promise<{
  total: number;
  completed: number;
  uncompleted: number;
  todayDue: number;
}> {
  const tasks = await getTasksByQuadrant(quadrant);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.isCompleted).length,
    uncompleted: tasks.filter((t) => !t.isCompleted).length,
    todayDue: tasks.filter((t) => {
      if (!t.deadline || t.isCompleted) return false;
      const deadline = new Date(t.deadline);
      return deadline >= today && deadline < tomorrow;
    }).length,
  };
}
