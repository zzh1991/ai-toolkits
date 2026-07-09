// src/modules/gold/components/PriceDisplay.tsx
import { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendUp, TrendDown, CurrencyDollar } from '@phosphor-icons/react';
import { cn } from '@/shared/lib/utils';
import type { CurrentGoldPrice } from '../api/goldApi';

interface PriceDisplayProps {
  price: CurrentGoldPrice | null;
  isLoading: boolean;
}

export default memo(function PriceDisplay({ price, isLoading }: PriceDisplayProps) {
  const isUp = (price?.changePercent24h ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl bg-[#141416] border border-white/[0.06] p-8"
    >
      {/* 背景渐变 */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <CurrencyDollar weight="bold" className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-sm text-white/50">实时金价</span>
          <span className="text-xs text-white/30 ml-auto">
            {price?.updatedAt && `更新于 ${price.updatedAt.toLocaleTimeString('zh-CN')}`}
          </span>
        </div>

        {isLoading && !price ? (
          <div className="space-y-3">
            <div className="h-14 w-48 rounded-xl bg-white/[0.05] animate-pulse" />
            <div className="h-6 w-32 rounded-lg bg-white/[0.05] animate-pulse" />
          </div>
        ) : price ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-bold tabular-nums tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
                ¥{price.priceCNY.toFixed(2)}
              </span>
              <span className="text-lg text-white/40">/克</span>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                  isUp
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                )}
              >
                {isUp ? (
                  <TrendUp weight="bold" className="w-4 h-4" />
                ) : (
                  <TrendDown weight="bold" className="w-4 h-4" />
                )}
                {isUp ? '+' : ''}{price.changePercent24h.toFixed(2)}%
              </div>
              <span className="text-sm text-white/30">
                ${price.priceUSD.toFixed(2)}/盎司
              </span>
            </div>
          </>
        ) : null}
      </div>
    </motion.div>
  );
});
