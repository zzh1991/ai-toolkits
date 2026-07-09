// src/modules/gold/api/goldApi.ts
// 数据源：腾讯财经实时 + 内置历史静态数据 + open.er-api.com 汇率
// 1 金衡盎司 = 31.1035 克

import staticHistoryData from '../data/gold-history.json';

const OUNCE_TO_GRAM = 31.1035;

// ---- 缓存 ----
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// ---- 数据模型 ----
export interface GoldPricePoint {
  timestamp: number;
  date: string;      // YYYY-MM-DD
  priceCNY: number;  // 元/克
  priceUSD: number;  // 美元/盎司
}

export interface CurrentGoldPrice {
  priceCNY: number;
  priceUSD: number;
  changePercent24h: number;
  updatedAt: Date;
}

interface StaticKlineRecord {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// ---- 汇率 ----
async function fetchExchangeRate(): Promise<number> {
  const cached = getCached<number>('usd_cny_rate');
  if (cached) return cached;

  const res = await fetch('https://open.er-api.com/v6/latest/USD');
  if (!res.ok) throw new Error('获取汇率失败');
  const json = await res.json();
  const rate = json.rates?.CNY as number | undefined;
  if (!rate) throw new Error('汇率数据中缺少 CNY');

  setCache('usd_cny_rate', rate, 60 * 60 * 1000);
  return rate;
}

function usdPerOunceToCnyPerGram(usdPerOunce: number, cnyPerUsd: number): number {
  return (usdPerOunce * cnyPerUsd) / OUNCE_TO_GRAM;
}

// ---- 实时价格（腾讯财经，无需 Key，CORS）----
async function parseTencentGold(text: string): Promise<{ priceUSD: number; changePct: number }> {
  const match = text.match(/v_hf_XAU="([^"]+)"/);
  if (!match) throw new Error('解析行情数据失败');

  const fields = match[1].split(',');
  const priceUSD = parseFloat(fields[0]);
  const changePct = parseFloat(fields[1]);

  if (isNaN(priceUSD)) throw new Error('价格数据异常');
  return { priceUSD, changePct };
}

export async function fetchCurrentPrice(): Promise<CurrentGoldPrice> {
  const cached = getCached<CurrentGoldPrice>('gold_current');
  if (cached) return cached;

  const [res, rate] = await Promise.all([
    fetch('https://qt.gtimg.cn/q=hf_XAU'),
    fetchExchangeRate(),
  ]);

  if (!res.ok) throw new Error('获取实时价格失败');

  const buffer = await res.arrayBuffer();
  const text = new TextDecoder('gbk').decode(buffer);
  const { priceUSD, changePct } = await parseTencentGold(text);
  const priceCNY = usdPerOunceToCnyPerGram(priceUSD, rate);

  const result: CurrentGoldPrice = {
    priceCNY: Math.round(priceCNY * 100) / 100,
    priceUSD: Math.round(priceUSD * 100) / 100,
    changePercent24h: Math.round(changePct * 100) / 100,
    updatedAt: new Date(),
  };

  setCache('gold_current', result, 30 * 1000);
  return result;
}

// ---- 历史数据（内置静态 + IndexedDB 积累）----
const IDB_NAME = 'gold-price-db';
const IDB_STORE = 'extra-prices';
const IDB_VERSION = 1;

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'date' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// 保存今日价格到 IndexedDB（去重）
export async function saveTodayPrice(priceUSD: number): Promise<void> {
  try {
    const db = await openIDB();
    const today = formatDate(new Date());
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put({ date: today, close: priceUSD });
    db.close();
  } catch {
    // IndexedDB 失败不影响主流程
  }
}

// 获取 IndexedDB 中的额外历史数据
async function getExtraHistory(): Promise<StaticKlineRecord[]> {
  try {
    const db = await openIDB();
    const tx = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const all = await new Promise<StaticKlineRecord[]>((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return all;
  } catch {
    return [];
  }
}

// 获取历史走势：内置数据 + 用户积累数据
export async function fetchPriceHistory(days: number): Promise<GoldPricePoint[]> {
  const rate = await fetchExchangeRate();

  // 合并内置数据和 IndexedDB 数据
  const staticData = staticHistoryData as StaticKlineRecord[];
  const extraData = await getExtraHistory();

  // 用 Map 去重（IndexedDB 数据覆盖内置数据）
  const merged = new Map<string, StaticKlineRecord>();
  for (const record of staticData) {
    merged.set(record.date, record);
  }
  for (const record of extraData) {
    merged.set(record.date, record);
  }

  // 按日期排序，取最近 N 天
  const sorted = Array.from(merged.values()).sort((a, b) => a.date.localeCompare(b.date));
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = formatDate(cutoff);

  const filtered = sorted.filter(r => r.date >= cutoffStr);

  return filtered.map((r) => {
    const [y, m, d] = r.date.split('-').map(Number);
    const ts = new Date(y, m - 1, d).getTime();
    return {
      timestamp: ts,
      date: r.date,
      priceUSD: Math.round(r.close * 100) / 100,
      priceCNY: Math.round(usdPerOunceToCnyPerGram(r.close, rate) * 100) / 100,
    };
  });
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
