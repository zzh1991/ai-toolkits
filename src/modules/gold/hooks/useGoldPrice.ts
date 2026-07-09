// src/modules/gold/hooks/useGoldPrice.ts
import { useState, useEffect, useCallback } from 'react';
import {
  fetchCurrentPrice,
  fetchPriceHistory,
  saveTodayPrice,
  type CurrentGoldPrice,
  type GoldPricePoint,
} from '../api/goldApi';
import { calculateBuyAdvice, type BuyAdvice } from '../lib/advice';

export type Period = 30 | 60 | 90;

interface UseGoldPriceState {
  currentPrice: CurrentGoldPrice | null;
  history: GoldPricePoint[];
  advice: BuyAdvice | null;
  period: Period;
  isLoading: boolean;
  error: string | null;
  setPeriod: (period: Period) => void;
  refresh: () => Promise<void>;
}

export function useGoldPrice(): UseGoldPriceState {
  const [currentPrice, setCurrentPrice] = useState<CurrentGoldPrice | null>(null);
  const [history, setHistory] = useState<GoldPricePoint[]>([]);
  const [advice, setAdvice] = useState<BuyAdvice | null>(null);
  const [period, setPeriod] = useState<Period>(30);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (days: Period) => {
    setIsLoading(true);
    setError(null);
    try {
      const [price, historyData] = await Promise.all([
        fetchCurrentPrice(),
        fetchPriceHistory(days),
      ]);
      setCurrentPrice(price);
      setHistory(historyData);

      if (historyData.length > 0) {
        setAdvice(calculateBuyAdvice(price.priceCNY, historyData, days));
      }

      // 保存今日价格到 IndexedDB（用于未来积累）
      saveTodayPrice(price.priceUSD);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSetPeriod = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod);
    loadData(newPeriod);
  }, [loadData]);

  const refresh = useCallback(async () => {
    await loadData(period);
  }, [period, loadData]);

  // 初始加载
  useEffect(() => {
    loadData(period);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 每 30 秒自动刷新当前价格
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const price = await fetchCurrentPrice();
        setCurrentPrice(price);
        if (history.length > 0) {
          setAdvice(calculateBuyAdvice(price.priceCNY, history, period));
        }
      } catch {
        // 静默失败
      }
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, [history, period]);

  return {
    currentPrice,
    history,
    advice,
    period,
    isLoading,
    error,
    setPeriod: handleSetPeriod,
    refresh,
  };
}
