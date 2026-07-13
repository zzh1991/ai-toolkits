// src/routes/gold/GoldPage.tsx
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowsClockwise, Coin } from '@phosphor-icons/react';
import PriceDisplay from '@/modules/gold/components/PriceDisplay';
import PriceChart from '@/modules/gold/components/PriceChart';
import BuyAdviceCard from '@/modules/gold/components/BuyAdvice';
import PeriodSelector from '@/modules/gold/components/PeriodSelector';
import { useGoldPrice } from '@/modules/gold/hooks/useGoldPrice';

export default function GoldPage() {
  const {
    currentPrice,
    history,
    advice,
    period,
    isLoading,
    error,
    setPeriod,
    refresh,
  } = useGoldPrice();

  return (
    <div className="min-h-screen bg-[#0a0a0b] noise-overlay">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: 'transform, opacity' }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className="mx-4 mt-4">
          <div className="max-w-3xl mx-auto px-6 py-3 rounded-2xl bg-[#0a0a0b]/80 backdrop-blur-xl border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <ArrowLeft weight="bold" className="w-4 h-4" />
                <span className="text-sm">首页</span>
              </Link>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                  <Coin weight="fill" className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-semibold text-white tracking-tight">黄金价格</span>
              </div>

              <button
                onClick={refresh}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-[color,background-color] duration-200 disabled:opacity-50"
              >
                <ArrowsClockwise
                  weight="bold"
                  className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">刷新</span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 错误提示 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
            >
              {error}
              <button onClick={refresh} className="ml-3 underline hover:no-underline text-red-300">
                重试
              </button>
            </motion.div>
          )}

          {/* 实时价格 */}
          <PriceDisplay price={currentPrice} isLoading={isLoading} />

          {/* 时间段切换 */}
          <div className="flex justify-center">
            <PeriodSelector period={period} onChange={setPeriod} />
          </div>

          {/* 走势图 */}
          <PriceChart data={history} isLoading={isLoading} />

          {/* 买入建议 */}
          <BuyAdviceCard advice={advice} isLoading={isLoading} />

          {/* 数据来源 */}
          <div className="text-center pt-4 pb-8">
            <p className="text-xs text-white/20">
              实时行情：腾讯财经 · 历史数据：新浪财经 · 汇率：open.er-api.com
            </p>
            <p className="text-xs text-white/15 mt-1">
              XAU 为国际黄金现货价格，1 金衡盎司 ≈ 31.1035 克
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
