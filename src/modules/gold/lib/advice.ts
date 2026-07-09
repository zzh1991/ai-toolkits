// src/modules/gold/lib/advice.ts
// 基于技术指标的黄金买入建议算法

import type { GoldPricePoint } from '../api/goldApi';

export type AdviceLevel = 'strong-buy' | 'buy' | 'hold' | 'wait';

export interface BuyAdvice {
  level: AdviceLevel;
  score: number;       // -100 ~ 100，负数看跌，正数看涨
  reasons: string[];
}

// 计算移动平均线
function movingAverage(prices: number[], period: number): number | null {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

// 计算区间百分位（当前价格在历史数据中的位置）
function percentile(prices: number[], current: number): number {
  const below = prices.filter(p => p < current).length;
  return (below / prices.length) * 100;
}

// 线性回归斜率（标准化后）
function trendSlope(prices: number[]): number {
  const n = prices.length;
  if (n < 2) return 0;

  const xMean = (n - 1) / 2;
  const yMean = prices.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    const dx = i - xMean;
    const dy = prices[i] - yMean;
    numerator += dx * dy;
    denominator += dx * dx;
  }

  if (denominator === 0) return 0;
  const slope = numerator / denominator;

  // 标准化为百分比变化/天
  return (slope / yMean) * 100;
}

export function calculateBuyAdvice(
  currentPrice: number,
  history: GoldPricePoint[],
  days: number,
): BuyAdvice {
  if (history.length === 0) {
    return { level: 'hold', score: 0, reasons: ['历史数据不足，无法给出建议'] };
  }

  const prices = history.map(p => p.priceCNY);
  const reasons: string[] = [];
  let score = 0;

  // 1. 区间百分位（权重 35%）
  //    越低越值得买入
  const pct = percentile(prices, currentPrice);
  if (pct < 20) {
    score += 35;
    reasons.push(`当前价格处于近 ${days} 天最低 ${Math.round(pct)}% 区间，价格优势明显`);
  } else if (pct < 40) {
    score += 18;
    reasons.push(`当前价格低于近 ${days} 天 ${Math.round(100 - pct)}% 的时间`);
  } else if (pct < 60) {
    score += 0;
    reasons.push(`当前价格处于近 ${days} 天中等水平`);
  } else if (pct < 80) {
    score -= 18;
    reasons.push(`当前价格高于近 ${days} 天 ${Math.round(pct)}% 的时间，处于偏高区间`);
  } else {
    score -= 35;
    reasons.push(`当前价格处于近 ${days} 天最高 ${Math.round(100 - pct)}% 区间，注意追高风险`);
  }

  // 2. 均线偏离度（权重 35%）
  const ma30 = movingAverage(prices, Math.min(30, prices.length));
  if (ma30 !== null) {
    const deviation30 = ((currentPrice - ma30) / ma30) * 100;
    if (deviation30 < -3) {
      score += 25;
      reasons.push(`较 30 日均价低 ${Math.abs(deviation30).toFixed(1)}%，存在均值回归机会`);
    } else if (deviation30 < -1) {
      score += 10;
      reasons.push(`略低于 30 日均价 ${Math.abs(deviation30).toFixed(1)}%`);
    } else if (deviation30 > 3) {
      score -= 25;
      reasons.push(`较 30 日均价高 ${deviation30.toFixed(1)}%，短期可能回调`);
    } else if (deviation30 > 1) {
      score -= 10;
      reasons.push(`略高于 30 日均价 ${deviation30.toFixed(1)}%`);
    } else {
      reasons.push('当前价格接近 30 日均价');
    }
  }

  // 3. 趋势斜率（权重 30%）
  const slope = trendSlope(prices);
  if (slope < -0.3) {
    score += 20;
    reasons.push(`近期呈下跌趋势（日均跌幅 ${Math.abs(slope).toFixed(2)}%），可能继续探底`);
  } else if (slope < -0.05) {
    score += 10;
    reasons.push('近期价格小幅下行');
  } else if (slope > 0.3) {
    score -= 20;
    reasons.push(`近期呈上涨趋势（日均涨幅 ${slope.toFixed(2)}%），追涨需谨慎`);
  } else if (slope > 0.05) {
    score -= 10;
    reasons.push('近期价格小幅上行');
  } else {
    reasons.push('近期价格走势平稳');
  }

  // 限制范围
  score = Math.max(-100, Math.min(100, score));

  // 确定建议等级
  let level: AdviceLevel;
  if (score >= 40) level = 'strong-buy';
  else if (score >= 10) level = 'buy';
  else if (score >= -10) level = 'hold';
  else level = 'wait';

  return { level, score, reasons };
}

export function getAdviceLabel(level: AdviceLevel): string {
  switch (level) {
    case 'strong-buy': return '建议买入';
    case 'buy': return '可以考虑';
    case 'hold': return '观望为主';
    case 'wait': return '建议等待';
  }
}

export function getAdviceColor(level: AdviceLevel): string {
  switch (level) {
    case 'strong-buy': return 'text-emerald-400';
    case 'buy': return 'text-green-400';
    case 'hold': return 'text-amber-400';
    case 'wait': return 'text-red-400';
  }
}
