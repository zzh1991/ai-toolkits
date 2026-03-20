// src/modules/reminder/components/ReminderCard.tsx
import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { cn, formatDateDisplay } from '@/shared/lib/utils';
import type { ReminderCardProps } from '@/modules/reminder/types/reminder';
import { CARD_THEMES } from '@/shared/constants/colors';

// 使用 memo 避免不必要的重渲染
export default memo(function ReminderCard({ reminder, onEdit, onDelete }: ReminderCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const theme = CARD_THEMES.find((t) => t.name === reminder.color) || CARD_THEMES[0];
  const isPast = reminder.days < 0;
  const daysCount = Math.abs(reminder.days);
  const daysLabel = isPast ? '已过' : '还剩';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      // 优化：使用更短的动画时长和更高效的缓动函数
      transition={{
        duration: 0.25,
        ease: [0.25, 0.46, 0.45, 0.94], // 自定义 cubic-bezier，更流畅
        opacity: { duration: 0.2 },
      }}
      // 优化：移除 layout prop 避免昂贵的布局计算
      // 使用 CSS transform 代替
      style={{
        background: `linear-gradient(135deg, ${theme.bg} 0%, rgba(255,255,255,0.05) 100%)`,
        willChange: 'transform, opacity',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-xl',
        'border border-white/10 shadow-xl transition-shadow transition-transform',
        'sm:hover:shadow-2xl sm:hover:-translate-y-1'
      )}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1 sm:w-1.5"
        style={{
          background: `linear-gradient(180deg, ${theme.from} 0%, ${theme.to} 100%)`,
        }}
      />

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Days count */}
        <div className="flex flex-col items-center justify-center min-w-[60px] sm:min-w-[80px]">
          <span
            className="text-2xl sm:text-4xl font-bold tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {daysCount}
          </span>
          <span className="text-xs text-white/60 mt-0.5 sm:mt-1">天</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-16 sm:pr-0">
          <h3 className="text-base sm:text-lg font-semibold text-white/90 truncate">
            {reminder.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/50 mt-0.5 sm:mt-1">
            {daysLabel} · {formatDateDisplay(reminder.date, reminder.dateType)}
            {reminder.isRepeating && ' · 每年重复'}
          </p>
        </div>

        {/* Actions - 移动端始终显示，桌面端hover显示 */}
        <div
          className={cn(
            'flex items-center gap-1 sm:gap-2',
            'absolute right-3 sm:relative sm:right-auto',
            'transition-opacity duration-200',
            'sm:opacity-0 sm:group-hover:opacity-100',
            isHovered ? 'opacity-100' : 'opacity-100 sm:opacity-0'
          )}
        >
          <button
            onClick={onEdit}
            className={cn(
              'p-1.5 sm:p-2 rounded-full transition-colors',
              'bg-white/10 sm:bg-white/5 hover:bg-white/10 text-white/70 sm:text-white/60 hover:text-white'
            )}
            aria-label="编辑"
          >
            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={onDelete}
            className={cn(
              'p-1.5 sm:p-2 rounded-full transition-colors',
              'bg-white/10 sm:bg-white/5 hover:bg-red-500/20 text-white/70 sm:text-white/60 hover:text-red-400'
            )}
            aria-label="删除"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});
