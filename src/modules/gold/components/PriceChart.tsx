// src/modules/gold/components/PriceChart.tsx
import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { GoldPricePoint } from '../api/goldApi';

interface PriceChartProps {
  data: GoldPricePoint[];
  isLoading: boolean;
}

interface TooltipPayloadEntry {
  value: number;
  payload: GoldPricePoint;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadEntry[] }) {
  if (!active || !payload?.length) return null;
  const { date, priceCNY } = payload[0].payload;
  return (
    <div className="rounded-xl bg-[#1a1a1d] border border-white/[0.08] px-4 py-3 shadow-2xl">
      <p className="text-xs text-white/40 mb-1">{date}</p>
      <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
        ¥{priceCNY.toFixed(2)}<span className="text-sm text-white/40 ml-1">/克</span>
      </p>
    </div>
  );
}

export default memo(function PriceChart({ data, isLoading }: PriceChartProps) {
  const { minPrice, maxPrice } = useMemo(() => {
    if (data.length === 0) return { minPrice: 0, maxPrice: 0 };
    const prices = data.map(d => d.priceCNY);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    return { minPrice: Math.floor(min - padding), maxPrice: Math.ceil(max + padding) };
  }, [data]);

  // 格式化 X 轴日期（只显示月-日）
  const formatXAxis = (date: string) => {
    const parts = date.split('-');
    return `${parts[1]}/${parts[2]}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl bg-[#141416] border border-white/[0.06] p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white/90">价格走势</h3>
        <span className="text-xs text-white/30">单位：元/克</span>
      </div>

      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-white/30">
          暂无数据
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `¥${v}`}
              width={60}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'rgba(245,158,11,0.3)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="priceCNY"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#goldGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#f59e0b',
                stroke: '#141416',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
});
