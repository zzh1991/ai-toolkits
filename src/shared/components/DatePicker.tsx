// src/shared/components/DatePicker.tsx
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  X,
} from '@phosphor-icons/react';
import { cn } from '@/shared/lib/utils';
import { Lunar, Solar, LunarYear, LunarMonth } from 'lunar-typescript';

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  accentColor?: 'blue' | 'emerald' | 'amber';
  dateType?: 'solar' | 'lunar';
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const MONTHS = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];

// 农历月份名称
const LUNAR_MONTHS = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月',
];

export default function DatePicker({
  value,
  onChange,
  placeholder = '选择日期',
  className,
  accentColor = 'blue',
  dateType = 'solar',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      if (dateType === 'lunar') {
        // 对于农历，我们使用当前年份，月份设为1月
        const [year] = value.split('-').map(Number);
        return new Date(year, 0, 1);
      }
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

  // Update currentMonth when value changes or dateType changes
  useEffect(() => {
    if (value) {
      const [year, month] = value.split('-').map(Number);
      if (dateType === 'lunar') {
        // 农历模式下，使用当前显示年份
        setCurrentMonth(new Date(currentMonth.getFullYear(), 0, 1));
      } else {
        setCurrentMonth(new Date(year, month - 1, 1));
      }
    }
  }, [value, dateType]);

  // 获取农历月份信息
  const getLunarMonths = useCallback((year: number) => {
    const months: { month: number; isLeap: boolean; name: string; days: number }[] = [];
    const lunarYear = LunarYear.fromYear(year);
    const leapMonth = lunarYear.getLeapMonth();

    for (let i = 1; i <= 12; i++) {
      const lunarMonth = LunarMonth.fromYm(year, i);
      if (lunarMonth) {
        months.push({
          month: i,
          isLeap: false,
          name: LUNAR_MONTHS[i - 1],
          days: lunarMonth.getDayCount(),
        });
      }
      // 如果有闰月且当前是闰月
      if (leapMonth === i) {
        // 闰月使用下一个月的 LunarMonth 来获取天数，或者使用固定值
        const leapLunarMonth = LunarMonth.fromYm(year, i + 1);
        const leapDays = leapLunarMonth ? leapLunarMonth.getDayCount() : 30;
        months.push({
          month: i,
          isLeap: true,
          name: `闰${LUNAR_MONTHS[i - 1]}`,
          days: leapDays,
        });
      }
    }
    return months;
  }, []);

  // 获取当前显示的农历月
  const lunarMonths = useMemo(() => {
    return getLunarMonths(currentMonth.getFullYear());
  }, [currentMonth.getFullYear(), getLunarMonths]);

  // 当前显示的农历月索引
  const [lunarMonthIndex, setLunarMonthIndex] = useState(0);

  // 当切换年份时重置农历月索引
  useEffect(() => {
    setLunarMonthIndex(0);
  }, [currentMonth.getFullYear()]);

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

  // 获取农历月的日期列表（用于日历网格显示）
  const getLunarMonthDays = useCallback(() => {
    const currentLunarMonth = lunarMonths[lunarMonthIndex];
    if (!currentLunarMonth) return [];

    const year = currentMonth.getFullYear();
    // 获取该农历月第一天的阳历日期
    const firstDayLunar = Lunar.fromYmd(year, currentLunarMonth.month, 1);
    const firstDaySolar = firstDayLunar.getSolar();

    const firstDayOfWeek = new Date(firstDaySolar.getYear(), firstDaySolar.getMonth() - 1, firstDaySolar.getDay()).getDay();

    const days: (number | null)[] = [];

    // 空单元格
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // 农历月的每一天
    for (let i = 1; i <= currentLunarMonth.days; i++) {
      days.push(i);
    }

    return days;
  }, [lunarMonths, lunarMonthIndex, currentMonth]);

  const handleDateSelect = useCallback((day: number) => {
    if (dateType === 'lunar') {
      const currentLunarMonth = lunarMonths[lunarMonthIndex];
      if (!currentLunarMonth) return;
      const year = currentMonth.getFullYear();
      const month = currentLunarMonth.month;
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onChange(dateString);
    } else {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onChange(dateString);
    }
    setIsOpen(false);
  }, [currentMonth, lunarMonths, lunarMonthIndex, onChange, dateType]);

  const handlePrevMonth = useCallback(() => {
    if (dateType === 'lunar') {
      if (lunarMonthIndex > 0) {
        setLunarMonthIndex(lunarMonthIndex - 1);
      } else {
        // 上一年的最后一个月
        const newYear = currentMonth.getFullYear() - 1;
        setCurrentMonth(new Date(newYear, 0, 1));
        const prevYearMonths = getLunarMonths(newYear);
        setLunarMonthIndex(prevYearMonths.length - 1);
      }
    } else {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }
  }, [currentMonth, lunarMonthIndex, dateType]);

  const handleNextMonth = useCallback(() => {
    if (dateType === 'lunar') {
      if (lunarMonthIndex < lunarMonths.length - 1) {
        setLunarMonthIndex(lunarMonthIndex + 1);
      } else {
        // 下一年的第一个月
        const newYear = currentMonth.getFullYear() + 1;
        setCurrentMonth(new Date(newYear, 0, 1));
        setLunarMonthIndex(0);
      }
    } else {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    }
  }, [currentMonth, lunarMonths.length, lunarMonthIndex, dateType]);

  const handleToday = useCallback(() => {
    const today = new Date();
    if (dateType === 'lunar') {
      // 获取今天的农历日期
      const solar = Solar.fromYmd(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const lunar = solar.getLunar();
      const year = lunar.getYear();
      const month = lunar.getMonth();
      const day = lunar.getDay();
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onChange(dateString);
      setCurrentMonth(new Date(year, 0, 1));
      setLunarMonthIndex(month - 1);
    } else {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
      setCurrentMonth(new Date(year, today.getMonth(), 1));
    }
    setIsOpen(false);
  }, [onChange, dateType]);

  const handleTomorrow = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateType === 'lunar') {
      const solar = Solar.fromYmd(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate());
      const lunar = solar.getLunar();
      const year = lunar.getYear();
      const month = lunar.getMonth();
      const day = lunar.getDay();
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onChange(dateString);
      setCurrentMonth(new Date(year, 0, 1));
      setLunarMonthIndex(month - 1);
    } else {
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const day = String(tomorrow.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
      setCurrentMonth(new Date(year, tomorrow.getMonth(), 1));
    }
    setIsOpen(false);
  }, [onChange, dateType]);

  const handleNextWeek = useCallback(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    if (dateType === 'lunar') {
      const solar = Solar.fromYmd(nextWeek.getFullYear(), nextWeek.getMonth() + 1, nextWeek.getDate());
      const lunar = solar.getLunar();
      const year = lunar.getYear();
      const month = lunar.getMonth();
      const day = lunar.getDay();
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onChange(dateString);
      setCurrentMonth(new Date(year, 0, 1));
      setLunarMonthIndex(month - 1);
    } else {
      const year = nextWeek.getFullYear();
      const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
      const day = String(nextWeek.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
      setCurrentMonth(new Date(year, nextWeek.getMonth(), 1));
    }
    setIsOpen(false);
  }, [onChange, dateType]);

  const clearDate = useCallback(() => {
    onChange('');
    setIsOpen(false);
  }, [onChange]);

  // 根据日期类型获取日历天数
  const days = useMemo(() => {
    if (dateType === 'lunar') {
      return getLunarMonthDays();
    }
    return getDaysInMonth(currentMonth);
  }, [dateType, currentMonth, lunarMonthIndex, getLunarMonthDays]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // 获取当前显示的农历月份名称
  const currentLunarMonth = lunarMonths[lunarMonthIndex];

  // Memoize selected and today checks to avoid recalculation on every render
  const selectedDay = useMemo(() => {
    if (!value) return null;
    const [vYear, vMonth, vDay] = value.split('-').map(Number);
    if (dateType === 'lunar') {
      // 农历模式：检查年份和月份
      if (currentLunarMonth && vYear === year && vMonth === currentLunarMonth.month) return vDay;
    } else {
      if (vYear === year && vMonth === month + 1) return vDay;
    }
    return null;
  }, [value, year, month, dateType, currentLunarMonth]);

  const todayDay = useMemo(() => {
    const today = new Date();
    if (dateType === 'lunar') {
      // 获取今天的农历日期
      const solar = Solar.fromYmd(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const lunar = solar.getLunar();
      if (currentLunarMonth && lunar.getYear() === year && lunar.getMonth() === currentLunarMonth.month) {
        return lunar.getDay();
      }
    } else {
      if (today.getFullYear() === year && today.getMonth() === month) {
        return today.getDate();
      }
    }
    return null;
  }, [year, month, dateType, currentLunarMonth]);

  const isSelected = (day: number) => selectedDay === day;
  const isToday = (day: number) => todayDay === day;

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

  // 格式化显示值
  const formatDisplayValue = useCallback(() => {
    if (!value) return placeholder;
    const [vYear, vMonth, vDay] = value.split('-').map(Number);
    if (dateType === 'lunar') {
      // 农历显示
      const lunar = Lunar.fromYmd(vYear, vMonth, vDay);
      return lunar.toString();
    }
    // 阳历显示
    return `${vYear}年${String(vMonth).padStart(2, '0')}月${String(vDay).padStart(2, '0')}日`;
  }, [value, dateType, placeholder]);

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
            {formatDisplayValue()}
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
              'fixed inset-x-4 top-auto mt-2 z-[100]',
              'sm:absolute sm:inset-x-auto sm:top-full sm:left-0 sm:w-[320px]',
              'p-4 sm:p-5 rounded-2xl',
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
                {dateType === 'lunar' && currentLunarMonth
                  ? `${year}年 ${currentLunarMonth.name}`
                  : `${year}年 ${MONTHS[month]}`}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all duration-150"
              >
                <CaretRight weight="bold" className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Headers - 仅阳历显示 */}
            {dateType !== 'lunar' && (
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
            )}

            {/* Calendar Grid */}
            <div className={cn('grid gap-1', dateType === 'lunar' ? 'grid-cols-7' : 'grid-cols-7')}>
              {days.map((day: number | null, index: number) => (
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
