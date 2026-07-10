// src/db/stores/parkingStore.ts
import { db } from '../index';
import type { ParkingRecord } from '../schema';

// 获取所有活跃的停车记录
export async function getActiveParking(): Promise<ParkingRecord | undefined> {
  return db.parkingRecords.filter((record) => record.isActive).first();
}

// 获取所有历史停车记录（已结束），按创建时间倒序
export async function getParkingHistory(): Promise<ParkingRecord[]> {
  return db.parkingRecords
    .filter((record) => !record.isActive)
    .reverse()
    .sortBy('createdAt');
}

// 开始新的停车
export async function startParking(): Promise<number> {
  // 先结束所有活跃的停车（防止有残留）
  const active = await getActiveParking();
  if (active) {
    await endParking(active.id!);
  }

  const id = await db.parkingRecords.add({
    startTime: new Date(),
    isActive: true,
    createdAt: new Date(),
  });

  if (id === undefined) {
    throw new Error('Failed to add parking record');
  }

  return id;
}

// 结束停车
export async function endParking(id: number): Promise<void> {
  await db.parkingRecords.update(id, {
    endTime: new Date(),
    isActive: false,
  });
}

// 修改停车开始时间
export async function updateParkingStartTime(id: number, startTime: Date): Promise<void> {
  if (Number.isNaN(startTime.getTime()) || startTime.getTime() > Date.now()) {
    throw new Error('停车开始时间不能晚于当前时间');
  }

  await db.parkingRecords.update(id, { startTime });
}

// 删除单条停车记录
export async function deleteParkingRecord(id: number): Promise<void> {
  await db.parkingRecords.delete(id);
}

// 清空所有历史停车记录
export async function clearParkingHistory(): Promise<void> {
  const records = await db.parkingRecords.filter((record) => !record.isActive).toArray();
  await Promise.all(records.map((record) => db.parkingRecords.delete(record.id!)));
}

// 获取停车时长（毫秒）
export function getParkingDuration(record: ParkingRecord): number {
  const endTime = record.endTime || new Date();
  return Math.max(0, endTime.getTime() - record.startTime.getTime());
}

// 格式化停车时长
export function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}小时${minutes}分钟${seconds}秒`;
  } else if (minutes > 0) {
    return `${minutes}分钟${seconds}秒`;
  } else {
    return `${seconds}秒`;
  }
}

// 格式化日期时间
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
