// src/modules/gold/components/BuyAdvice.tsx
import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendUp,
  CheckCircle,
  Clock,
  Warning,
  Scales,
} from '@phosphor-icons/react';
import { cn } from '@/shared/lib/utils';
import {
  getAdviceLabel,
  getAdviceColor,
  type BuyAdvice as BuyAdviceType,
} from '../lib/advice';

interface BuyAdviceProps {
  advice: BuyAdviceType | null;
  isLoading: boolean;
}

const levelIcons: Record<string, React.ReactNode> = {
  'strong-buy': <CheckCircle weight="fill" className="w-6 h-6" />,
  'buy': <TrendUp weight="fill" className="w-6 h-6" />,
  'hold': <Scales weight="fill" className="w-6 h-6" />,
  'wait': <Warning weight="fill" className="w-6 h-6" />,
};

const levelBg: Record<string, string> = {
  'strong-buy': 'bg-emerald-500/10 border-emerald-500/20',
  'buy': 'bg-green-500/10 border-green-500/20',
  'hold': 'bg-amber-500/10 border-amber-500/20',
  'wait': 'bg-red-500/10 border-red-500/20',
};

export default memo(function BuyAdviceCard({ advice, isLoading }: BuyAdviceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl bg-[#141416] border border-white/[0.06] p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Clock weight="bold" className="w-4 h-4 text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-white/90">买入建议</h3>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-12 w-40 rounded-xl bg-white/[0.05] animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-white/[0.05] animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-white/[0.05] animate-pulse" />
          </div>
        </div>
      ) : advice ? (
        <div>
          {/* 建议等级 */}
          <div
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border mb-5',
              levelBg[advice.level]
            )}
          >
            <span className={getAdviceColor(advice.level)}>
              {levelIcons[advice.level]}
            </span>
            <span className={cn('text-lg font-semibold', getAdviceColor(advice.level))}>
              {getAdviceLabel(advice.level)}
            </span>
          </div>

          {/* 分析理由 */}
          <div className="space-y-2.5">
            {advice.reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 mt-2 shrink-0" />
                <p className="text-sm text-white/50 leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>

          {/* 免责声明 */}
          <p className="mt-5 text-xs text-white/20 leading-relaxed">
            以上建议仅供参考，不构成投资建议。黄金市场受多种因素影响，请谨慎决策。
          </p>
        </div>
      ) : null}
    </motion.div>
  );
});
