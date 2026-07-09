// src/modules/vocab/components/VocabList.tsx
import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen } from '@phosphor-icons/react';
import type { WordEntry } from '@/db/schema';
import VocabCard from './VocabCard';
import type { VocabCategory, VocabLevel } from '../data/vocabularyData';

interface VocabListProps {
  words: WordEntry[];
  isLoading: boolean;
  onPlay: (word: string) => void;
}

export default memo(function VocabList({ words, isLoading, onPlay }: VocabListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-2xl bg-[#141416] border border-white/[0.06] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
          <BookOpen weight="duotone" className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-lg font-medium text-white/50 mb-2">没有找到匹配的单词</h3>
        <p className="text-sm text-white/30">试试调整搜索条件或筛选条件</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">
          共 <span className="text-white/70 font-medium">{words.length}</span> 个单词
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {words.map((word, index) => (
            <VocabCard
              key={word.id}
              english={word.english}
              chinese={word.chinese}
              synonyms={word.synonyms}
              level={word.level as VocabLevel}
              category={word.category as VocabCategory}
              onPlay={onPlay}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});
