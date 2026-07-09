// src/db/stores/vocabStore.ts
import { db } from '../index';
import type { WordEntry } from '../schema';
import { vocabularyData } from '@/modules/vocab/data/vocabularyData';

export async function getAllWords(): Promise<WordEntry[]> {
  return db.wordEntries.toArray();
}

export async function getWordById(id: number): Promise<WordEntry | undefined> {
  return db.wordEntries.get(id);
}

export async function seedVocabulary(): Promise<void> {
  const count = await db.wordEntries.count();
  if (count > 0) return;

  const entries: Omit<WordEntry, 'id'>[] = vocabularyData.map((w) => ({
    english: w.english,
    chinese: w.chinese,
    synonyms: w.synonyms.join(','),
    level: w.level,
    category: w.category,
  }));

  await db.wordEntries.bulkAdd(entries);
}

export async function searchWords(query: string): Promise<WordEntry[]> {
  if (!query.trim()) return db.wordEntries.toArray();

  const q = query.toLowerCase().trim();

  const allMatches = await db.wordEntries
    .filter((word) => {
      // 英文搜索
      if (word.english.toLowerCase().includes(q)) return true;
      // 中文搜索
      if (word.chinese.includes(q)) return true;
      // 同义词搜索
      if (word.synonyms && word.synonyms.toLowerCase().includes(q)) return true;
      return false;
    })
    .toArray();

  // 去重：同一个英文单词只保留一条记录
  const seen = new Set<string>();
  return allMatches.filter((word) => {
    const key = word.english.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getWordsByCategory(category: string): Promise<WordEntry[]> {
  if (!category) return db.wordEntries.toArray();
  return db.wordEntries.where('category').equals(category).toArray();
}

export async function getWordsByLevel(level: string): Promise<WordEntry[]> {
  if (!level) return db.wordEntries.toArray();
  return db.wordEntries.where('level').equals(level).toArray();
}
