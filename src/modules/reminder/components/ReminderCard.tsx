// src/modules/reminder/components/ReminderCard.tsx
import { memo } from 'react';
import { motion } from 'framer-motion';
import { PencilSimple, Trash } from '@phosphor-icons/react';
import { cn, formatDateDisplay } from '@/shared/lib/utils';
import type { ReminderCardProps } from '@/modules/reminder/types/reminder';
import { CARD_THEMES } from '@/shared/constants/colors';

// 使用 memo 避免不必要的重渲染
export default memo(function ReminderCard({ reminder, onEdit, onDelete }: ReminderCardProps) {
  const theme = CARD_THEMES.find((t) => t.name === reminder.color) || CARD_THEMES[0];
  const isPast = reminder.days < 0;
  const daysCount = Math.abs(reminder.days);
  const daysLabel = isPast ? '已过' : '还剩';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        willChange: 'transform, opacity',
      }}
      className={cn(
        'group relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6',
        'bg-[#141416] border border-white/[0.06]',
        'transition-all duration-300',
        'hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20'
      )}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1 sm:w-1.5"
        style={{
          background: `linear-gradient(180deg, ${theme.from} 0%, ${theme.to} 100%)`,
        }}
      />

      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${theme.bg} 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex items-center gap-3 sm:gap-6">
        {/* Days count */}
        <div className="flex flex-col items-center justify-center min-w-[60px] sm:min-w-[80px]">
          <span
            className="text-2xl sm:text-4xl font-semibold tracking-tight tabular-nums transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              willChange: 'transform',
            }}
          >
            {daysCount}
          </span>
          <span className="text-xs text-white/40 mt-0.5 sm:mt-1">天</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-16 sm:pr-0">
          <h3 className="text-base sm:text-lg font-medium text-white/90 truncate">
            {reminder.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/40 mt-0.5 sm:mt-1">
            {daysLabel} · {formatDateDisplay(reminder.date, reminder.dateType)}
            {reminder.isRepeating && (
              <span className="ml-2 text-white/30">· 每年重复</span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div
          className={cn(
            'flex items-center gap-1 sm:gap-1.5',
            'absolute right-3 sm:relative sm:right-auto',
            'transition-opacity duration-200',
            'sm:opacity-0 sm:group-hover:opacity-100'
          )}
        >
          <button
            onClick={onEdit}
            className={cn(
              'p-2 sm:p-2.5 rounded-xl transition-all duration-200',
              'bg-white/[0.05] hover:bg-white/10 text-white/50 hover:text-white',
              'transform hover:scale-105 active:scale-95'
            )}
            style={{ willChange: 'transform' }}
            aria-label="编辑"
          >
            <PencilSimple weight="bold" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={onDelete}
            className={cn(
              'p-2 sm:p-2.5 rounded-xl transition-all duration-200',
              'bg-white/[0.05] hover:bg-red-500/20 text-white/50 hover:text-red-400',
              'transform hover:scale-105 active:scale-95'
            )}
            style={{ willChange: 'transform' }}
            aria-label="删除"
          >
            <Trash weight="bold" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});
