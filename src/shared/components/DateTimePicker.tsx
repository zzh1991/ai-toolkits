// src/shared/components/DateTimePicker.tsx
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarBlank,
  Clock,
  CaretLeft,
  CaretRight,
  X,
} from '@phosphor-icons/react';
import { cn } from '@/shared/lib/utils';

interface DateTimePickerProps {
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

// Generate time slots every 15 minutes
const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = String(hour).padStart(2, '0');
      const m = String(minute).padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

export default function DateTimePicker({
  value,
  onChange,
  placeholder = '选择日期和时间',
  className,
  accentColor = 'emerald',
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const date = new Date(value);
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    return new Date();
  });
  const [selectedTime, setSelectedTime] = useState(() => {
    if (value) {
      const date = new Date(value);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(Math.floor(date.getMinutes() / 15) * 15).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '09:00';
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const timeListRef = useRef<HTMLDivElement>(null);

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

  // Update currentMonth and selectedTime when value changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(Math.floor(date.getMinutes() / 15) * 15).padStart(2, '0');
      setSelectedTime(`${hours}:${minutes}`);
    }
  }, [value]);

  // Scroll to selected time when tab changes
  useEffect(() => {
    if (activeTab === 'time' && timeListRef.current) {
      const selectedIndex = TIME_SLOTS.indexOf(selectedTime);
      if (selectedIndex !== -1) {
        const itemHeight = 36;
        timeListRef.current.scrollTop = selectedIndex * itemHeight - itemHeight * 3;
      }
    }
  }, [activeTab, selectedTime]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = useCallback((day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayString = String(day).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${dayString}T${selectedTime}`;
    onChange(dateTimeString);
    setActiveTab('time');
  }, [currentMonth, selectedTime, onChange]);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
    if (value) {
      const datePart = value.split('T')[0];
      onChange(`${datePart}T${time}`);
    } else {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}T${time}`);
    }
    setIsOpen(false);
  }, [value, onChange]);

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
    const time = selectedTime;
    onChange(`${year}-${month}-${day}T${time}`);
    setCurrentMonth(new Date(year, today.getMonth(), 1));
    setActiveTab('time');
  }, [selectedTime, onChange]);

  const handleTomorrow = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const time = selectedTime;
    onChange(`${year}-${month}-${day}T${time}`);
    setCurrentMonth(new Date(year, tomorrow.getMonth(), 1));
    setActiveTab('time');
  }, [selectedTime, onChange]);

  const clearDateTime = useCallback(() => {
    onChange('');
    setIsOpen(false);
  }, [onChange]);

  const days = getDaysInMonth(currentMonth);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const isSelected = (day: number) => {
    if (!value) return false;
    const date = new Date(value);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const formattedValue = useMemo(() => {
    if (!value) return '';
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  }, [value]);

  const accentClasses = {
    blue: {
      selected: 'bg-blue-500 text-white',
      hover: 'hover:bg-blue-500/10 hover:text-blue-400',
      today: 'text-blue-400 border-blue-500/50',
      button: 'text-blue-400 hover:bg-blue-500/10',
      accent: 'bg-blue-500',
      tabActive: 'bg-blue-500 text-white',
    },
    emerald: {
      selected: 'bg-emerald-500 text-[#0a0a0b]',
      hover: 'hover:bg-emerald-500/10 hover:text-emerald-400',
      today: 'text-emerald-400 border-emerald-500/50',
      button: 'text-emerald-400 hover:bg-emerald-500/10',
      accent: 'bg-emerald-500',
      tabActive: 'bg-emerald-500 text-[#0a0a0b]',
    },
    amber: {
      selected: 'bg-amber-500 text-[#0a0a0b]',
      hover: 'hover:bg-amber-500/10 hover:text-amber-400',
      today: 'text-amber-400 border-amber-500/50',
      button: 'text-amber-400 hover:bg-amber-500/10',
      accent: 'bg-amber-500',
      tabActive: 'bg-amber-500 text-[#0a0a0b]',
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
          'focus:border-emerald-500/50 focus:ring-emerald-500/10 focus:ring-1 focus:outline-none',
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
            {value ? formattedValue : placeholder}
          </span>
        </div>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearDateTime();
            }}
            className="p-1 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-150"
          >
            <X weight="bold" className="w-3.5 h-3.5" />
          </button>
        )}
      </button>

      {/* Picker Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute top-full left-0 mt-2 z-50',
              'w-[320px] rounded-2xl overflow-hidden',
              'bg-[#1a1a1c] border border-white/[0.08]',
              'shadow-2xl shadow-black/40'
            )}
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Tabs */}
            <div className="flex border-b border-white/[0.06]">
              <button
                type="button"
                onClick={() => setActiveTab('date')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium',
                  'transition-all duration-200',
                  activeTab === 'date'
                    ? cn(accent.tabActive)
                    : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03]'
                )}
              >
                <CalendarBlank weight="duotone" className="w-4 h-4" />
                日期
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('time')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium',
                  'transition-all duration-200',
                  activeTab === 'time'
                    ? cn(accent.tabActive)
                    : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03]'
                )}
              >
                <Clock weight="duotone" className="w-4 h-4" />
                时间
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {activeTab === 'date' ? (
                <div>
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
                  </div>
                </div>
              ) : (
                <div>
                  {/* Selected Date Display */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white/50">选择时间</span>
                    <span className="text-sm font-medium text-white">
                      {value
                        ? `${new Date(value).getFullYear()}年${new Date(value).getMonth() + 1}月${new Date(value).getDate()}日`
                        : '未选择日期'}
                    </span>
                  </div>

                  {/* Time Grid */}
                  <div
                    ref={timeListRef}
                    className="h-[200px] overflow-y-auto grid grid-cols-4 gap-1 pr-1"
                  >
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={cn(
                          'py-2 px-1 rounded-lg text-xs font-medium',
                          'transition-all duration-150',
                          selectedTime === time
                            ? accent.selected
                            : cn(
                                'text-white/60 hover:text-white',
                                'bg-white/[0.03] hover:bg-white/[0.06]'
                              )
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  {/* Back to Date Button */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('date')}
                    className={cn(
                      'w-full mt-3 py-2.5 rounded-lg text-sm font-medium',
                      'transition-all duration-150',
                      'bg-white/[0.03] hover:bg-white/[0.06]',
                      'text-white/70 hover:text-white'
                    )}
                  >
                    返回选择日期
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
