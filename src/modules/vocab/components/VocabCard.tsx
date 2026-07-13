// src/modules/vocab/components/VocabCard.tsx
import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { SpeakerHigh, Sparkle } from '@phosphor-icons/react';
import { cn } from '@/shared/lib/utils';
import { useMotionTransition, motionTransitions } from '@/shared/lib/motion';
import { CATEGORY_LABELS, LEVEL_LABELS } from '../data/vocabularyData';
import type { VocabCategory, VocabLevel } from '../data/vocabularyData';

// Color mapping for categories
const CATEGORY_COLORS: Record<VocabCategory, string> = {
  animals: 'from-amber-500/20 to-orange-500/20 border-amber-500/20',
  food: 'from-green-500/20 to-emerald-500/20 border-green-500/20',
  colors: 'from-pink-500/20 to-rose-500/20 border-pink-500/20',
  numbers: 'from-blue-500/20 to-indigo-500/20 border-blue-500/20',
  body: 'from-red-500/20 to-pink-500/20 border-red-500/20',
  family: 'from-violet-500/20 to-purple-500/20 border-violet-500/20',
  school: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/20',
  clothes: 'from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/20',
  weather: 'from-sky-500/20 to-blue-500/20 border-sky-500/20',
  home: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/20',
  actions: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/20',
  nature: 'from-lime-500/20 to-green-500/20 border-lime-500/20',
  transport: 'from-slate-500/20 to-gray-500/20 border-slate-500/20',
  emotions: 'from-rose-500/20 to-pink-500/20 border-rose-500/20',
  time: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/20',
};

interface VocabCardProps {
  english: string;
  chinese: string;
  synonyms: string;
  level: VocabLevel;
  category: VocabCategory;
  onPlay: (word: string) => void;
  index: number;
}

export default memo(function VocabCard({
  english,
  chinese,
  synonyms,
  level,
  category,
  onPlay,
  index,
}: VocabCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const synonymsList = synonyms ? synonyms.split(',').filter(Boolean) : [];
  const colorClass = CATEGORY_COLORS[category] || 'from-blue-500/20 to-indigo-500/20 border-blue-500/20';
  const transition = useMotionTransition({
    ...motionTransitions.entrance,
    delay: Math.min(index * 0.03, 0.5),
  });

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay(english);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      style={{ willChange: 'transform, opacity' }}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br border',
        colorClass,
        'transition-[transform,box-shadow] duration-300',
        'hover:scale-[1.01] hover:shadow-xl hover:shadow-black/20',
      )}
    >
      <div className="p-5">
        {/* Header: English word + Play button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-white tracking-tight truncate">
              {english}
            </h3>
            <p className="text-base text-white/60 mt-0.5">{chinese}</p>
          </div>

          <button
            onClick={handlePlay}
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-white/10 border border-white/10',
              'transition-[background-color,border-color,transform] duration-200',
              'hover:bg-white/20 hover:border-white/20 hover:scale-105',
              'active:scale-95',
              isPlaying && 'bg-blue-500/30 border-blue-500/40 scale-95',
            )}
            title="播放发音"
          >
            <SpeakerHigh
              weight={isPlaying ? 'fill' : 'bold'}
              className={cn(
                'w-5 h-5 transition-colors',
                isPlaying ? 'text-blue-300' : 'text-white/60',
              )}
            />
          </button>
        </div>

        {/* Synonyms */}
        {synonymsList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {synonymsList.map((syn) => (
              <span
                key={syn}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs text-white/50 bg-white/5 border border-white/[0.06]"
              >
                <Sparkle weight="fill" className="w-2.5 h-2.5 text-white/30" />
                {syn}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Level + Category */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
          <span className="text-xs text-white/40">{LEVEL_LABELS[level]}</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-white/40">{CATEGORY_LABELS[category]}</span>
        </div>
      </div>
    </motion.div>
  );
});
