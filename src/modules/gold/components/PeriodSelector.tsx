// src/modules/gold/components/PeriodSelector.tsx
import { memo } from 'react';
import { cn } from '@/shared/lib/utils';
import type { Period } from '../hooks/useGoldPrice';

interface PeriodSelectorProps {
  period: Period;
  onChange: (period: Period) => void;
}

const periods: { value: Period; label: string }[] = [
  { value: 30, label: '30 天' },
  { value: 60, label: '60 天' },
  { value: 90, label: '90 天' },
];

export default memo(function PeriodSelector({ period, onChange }: PeriodSelectorProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      {periods.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-[color,background-color] duration-200',
            period === value
              ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/20'
              : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
});
