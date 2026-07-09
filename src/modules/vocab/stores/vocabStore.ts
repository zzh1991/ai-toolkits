// src/modules/vocab/stores/vocabStore.ts
import { create } from 'zustand';
import type { WordEntry } from '@/db/schema';
import type { VocabLevel, VocabCategory } from '../data/vocabularyData';
import {
  seedVocabulary,
  searchWords as searchWordsDb,
} from '@/db/stores/vocabStore';

interface VocabState {
  words: WordEntry[];
  filteredWords: WordEntry[];
  searchQuery: string;
  selectedLevel: VocabLevel | '';
  selectedCategory: VocabCategory | '';
  isLoading: boolean;
  error: string | null;
  initialized: boolean;

  initVocabulary: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedLevel: (level: VocabLevel | '') => void;
  setSelectedCategory: (category: VocabCategory | '') => void;
  applyFilters: () => Promise<void>;
  playPronunciation: (word: string) => void;
}

export const useVocabStore = create<VocabState>((set, get) => ({
  words: [],
  filteredWords: [],
  searchQuery: '',
  selectedLevel: '',
  selectedCategory: '',
  isLoading: false,
  error: null,
  initialized: false,

  initVocabulary: async () => {
    if (get().initialized) return;
    set({ isLoading: true, error: null });
    try {
      await seedVocabulary();
      const allWords = await searchWordsDb('');
      // 去重：同一个英文单词只保留一条记录
      const seen = new Set<string>();
      const words = allWords.filter((w) => {
        const key = w.english.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      set({ words, filteredWords: words, isLoading: false, initialized: true });
    } catch (error) {
      set({ error: '加载词汇失败', isLoading: false });
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setSelectedLevel: (level) => {
    set({ selectedLevel: level });
    get().applyFilters();
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().applyFilters();
  },

  applyFilters: async () => {
    const { searchQuery, selectedLevel, selectedCategory, words } = get();
    let result: WordEntry[] = [];

    try {
      // 先进行搜索
      if (searchQuery.trim()) {
        result = await searchWordsDb(searchQuery);
      } else {
        result = [...words];
      }

      // 按级别过滤
      if (selectedLevel) {
        result = result.filter((w) => w.level === selectedLevel);
      }

      // 按分类过滤
      if (selectedCategory) {
        result = result.filter((w) => w.category === selectedCategory);
      }

      set({ filteredWords: result });
    } catch (error) {
      set({ error: '搜索失败' });
    }
  },

  playPronunciation: (word: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  },
}));
