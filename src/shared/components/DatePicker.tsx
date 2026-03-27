// src/shared/components/DatePicker.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  X,
} from '@phosphor-icons/react';
import { cn } from '@/shared/lib/utils';

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  accentColor?: 'blue' | 'emerald' | 'amber';
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const MONTHS = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];

export default function DatePicker({
  value,
  onChange,
  placeholder = '选择日期',
  className,
  accentColor = 'blue',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const [year, month] = value.split('-').map(Number);
      return new Date(year, month - 1, 1);
    }
    return new Date();
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Update currentMonth when value changes
  useEffect(() => {
    if (value) {
      const [year, month] = value.split('-').map(Number);
      setCurrentMonth(new Date(year, month - 1, 1));
    }
  }, [value]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = useCallback((day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateString);
    setIsOpen(false);
  }, [currentMonth, onChange]);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  }, [currentMonth]);

  const handleToday = useCallback(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
    setCurrentMonth(new Date(year, today.getMonth(), 1));
    setIsOpen(false);
  }, [onChange]);

  const handleTomorrow = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
    setCurrentMonth(new Date(year, tomorrow.getMonth(), 1));
    setIsOpen(false);
  }, [onChange]);

  const handleNextWeek = useCallback(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const year = nextWeek.getFullYear();
    const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
    const day = String(nextWeek.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
    setCurrentMonth(new Date(year, nextWeek.getMonth(), 1));
    setIsOpen(false);
  }, [onChange]);

  const clearDate = useCallback(() => {
    onChange('');
    setIsOpen(false);
  }, [onChange]);

  const days = getDaysInMonth(currentMonth);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const isSelected = (day: number) => {
    if (!value) return false;
    const [vYear, vMonth, vDay] = value.split('-').map(Number);
    return vYear === year && vMonth === month + 1 && vDay === day;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const accentClasses = {
    blue: {
      selected: 'bg-blue-500 text-white',
      hover: 'hover:bg-blue-500/10 hover:text-blue-400',
      today: 'text-blue-400 border-blue-500/50',
      button: 'text-blue-400 hover:bg-blue-500/10',
    },
    emerald: {
      selected: 'bg-emerald-500 text-[#0a0a0b]',
      hover: 'hover:bg-emerald-500/10 hover:text-emerald-400',
      today: 'text-emerald-400 border-emerald-500/50',
      button: 'text-emerald-400 hover:bg-emerald-500/10',
    },
    amber: {
      selected: 'bg-amber-500 text-[#0a0a0b]',
      hover: 'hover:bg-amber-500/10 hover:text-amber-400',
      today: 'text-amber-400 border-amber-500/50',
      button: 'text-amber-400 hover:bg-amber-500/10',
    },
  };

  const accent = accentClasses[accentColor];

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Input Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-3',
          'h-11 px-4 rounded-xl',
          'bg-white/[0.03] border border-white/[0.08]',
          'text-white placeholder:text-white/25',
          'transition-all duration-200',
          'hover:border-white/[0.12]',
          'focus:border-blue-500/50 focus:ring-blue-500/10 focus:ring-1 focus:outline-none',
          isOpen && 'border-white/[0.15]'
        )}
      >
        <div className="flex items-center gap-2">
          <CalendarBlank
            weight="duotone"
            className={cn(
              'w-4 h-4 transition-colors duration-200',
              value ? 'text-white/60' : 'text-white/30'
            )}
          />
          <span className={cn('text-sm', value ? 'text-white' : 'text-white/40')}>
            {value
              ? `${year}年${String(month + 1).padStart(2, '0')}月${String(parseInt(value.split('-')[2])).padStart(2, '0')}日`
              : placeholder}
          </span>
        </div>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearDate();
            }}
            className="p-1 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-150"
          >
            <X weight="bold" className="w-3.5 h-3.5" />
          </button>
        )}
      </button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute top-full left-0 mt-2 z-50',
              'w-[280px] p-4 rounded-2xl',
              'bg-[#1a1a1c] border border-white/[0.08]',
              'shadow-2xl shadow-black/40'
            )}
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all duration-150"
              >
                <CaretLeft weight="bold" className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-white">
                {year}年 {MONTHS[month]}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all duration-150"
              >
                <CaretRight weight="bold" className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-white/30 py-1 font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day !== null && (
                    <button
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={cn(
                        'w-full h-full rounded-lg text-sm font-medium',
                        'transition-all duration-150',
                        isSelected(day)
                          ? accent.selected
                          : cn(
                              'text-white/70 hover:text-white',
                              accent.hover,
                              isToday(day) && cn('border', accent.today)
                            )
                      )}
                    >
                      {day}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={handleToday}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg text-xs font-medium',
                  'transition-all duration-150',
                  'bg-white/[0.03] hover:bg-white/[0.06]',
                  accent.button
                )}
              >
                今天
              </button>
              <button
                type="button"
                onClick={handleTomorrow}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg text-xs font-medium',
                  'transition-all duration-150',
                  'bg-white/[0.03] hover:bg-white/[0.06]',
                  accent.button
                )}
              >
                明天
              </button>
              <button
                type="button"
                onClick={handleNextWeek}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg text-xs font-medium',
                  'transition-all duration-150',
                  'bg-white/[0.03] hover:bg-white/[0.06]',
                  accent.button
                )}
              >
                下周
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
