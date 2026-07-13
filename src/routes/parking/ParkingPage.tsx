// src/routes/parking/ParkingPage.tsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  getActiveParking,
  getParkingHistory,
  startParking,
  endParking,
  clearParkingHistory,
  formatDuration,
  formatDateTime,
  getParkingDuration,
  deleteParkingRecord,
  updateParkingStartTime,
} from '@/db/stores/parkingStore';
import type { ParkingRecord } from '@/db/schema';
import {
  ArrowLeft,
  Clock,
  CaretDown,
  CaretUp,
  Trash,
  Play,
  Square,
  Car,
  Calendar,
  PencilSimple,
  Check,
  X,
} from '@phosphor-icons/react';
import { cn } from '@/shared/lib/utils';

interface ActiveParkingProps {
  parking: ParkingRecord | null;
  onStart: () => void;
  onEnd: () => void;
  onUpdateStart: (startTime: Date) => Promise<void>;
}

function formatDateTimeInput(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

// TimerDisplay component - isolated to minimize re-renders
function TimerDisplay({ parking }: { parking: ParkingRecord }) {
  const [elapsedTime, setElapsedTime] = useState(() => getParkingDuration(parking));
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const updateElapsed = () => {
      const now = Date.now();
      // Only update state every 500ms to reduce re-renders
      if (now - lastUpdateRef.current >= 500) {
        setElapsedTime(getParkingDuration(parking));
        lastUpdateRef.current = now;
      }
      rafRef.current = requestAnimationFrame(updateElapsed);
    };

    rafRef.current = requestAnimationFrame(updateElapsed);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [parking]);

  return (
    <p className="text-5xl sm:text-6xl font-semibold tabular-nums tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
      {formatDuration(elapsedTime)}
    </p>
  );
}

function ActiveParking({ parking, onStart, onEnd, onUpdateStart }: ActiveParkingProps) {
  const [isEditingStart, setIsEditingStart] = useState(false);
  const [startTimeValue, setStartTimeValue] = useState('');
  const [editError, setEditError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (parking) {
      setStartTimeValue(formatDateTimeInput(parking.startTime));
    }
  }, [parking]);

  const handleSaveStartTime = useCallback(async () => {
    const nextStartTime = new Date(startTimeValue);

    if (!startTimeValue || Number.isNaN(nextStartTime.getTime())) {
      setEditError('请选择有效的开始时间');
      return;
    }

    if (nextStartTime.getTime() > Date.now()) {
      setEditError('开始时间不能晚于当前时间');
      return;
    }

    setIsSaving(true);
    setEditError('');
    try {
      await onUpdateStart(nextStartTime);
      setIsEditingStart(false);
    } catch {
      setEditError('保存失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  }, [onUpdateStart, startTimeValue]);

  const handleCancelEdit = useCallback(() => {
    if (parking) {
      setStartTimeValue(formatDateTimeInput(parking.startTime));
    }
    setEditError('');
    setIsEditingStart(false);
  }, [parking]);

  return (
    <motion.div
      layout
      layoutId="parking-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {parking && (
        <>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
        </>
      )}

      <Card className={cn(
        'relative overflow-hidden',
        parking
          ? 'border-amber-500/20 bg-[#141416]'
          : 'border border-white/[0.06] bg-[#141416]'
      )}>
        <AnimatePresence mode="wait">
          {!parking ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CardContent className="flex flex-col items-center justify-center py-16 sm:py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <Car weight="duotone" className="w-10 h-10 text-white/20" />
                </div>
                <p className="mb-8 text-white/40 text-lg">当前没有停车记录</p>
                <Button
                  size="lg"
                  onClick={onStart}
                  className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0b] border-0 rounded-full px-6 py-5 text-sm font-medium transition-[background-color,transform] duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play weight="fill" className="w-5 h-5 mr-2" />
                  开始停车
                </Button>
              </CardContent>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500">
                <motion.div
                  className="h-full bg-white/30"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-lg text-white font-medium">
                    <span className="relative flex h-2.5 w-2.5">
                      <motion.span
                        className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                    </span>
                    停车中
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-4">
                  <p className="text-white/30 text-sm mb-3 uppercase tracking-wider">已停时长</p>
                  <TimerDisplay parking={parking} />
                </div>

                <div className="rounded-2xl bg-white/[0.025] border border-white/[0.06] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-xs text-white/35 mb-1.5">
                        <Calendar weight="bold" className="w-3.5 h-3.5" />
                        停车开始时间
                      </p>
                      {!isEditingStart && (
                        <p className="text-sm font-medium text-white/80 tabular-nums">
                          {formatDateTime(parking.startTime)}
                        </p>
                      )}
                    </div>
                    {!isEditingStart && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingStart(true)}
                        className="h-8 shrink-0 rounded-lg px-2.5 text-xs text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10"
                      >
                        <PencilSimple weight="bold" className="w-3.5 h-3.5 mr-1.5" />
                        修改
                      </Button>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {isEditingStart && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="mt-3"
                      >
                        <input
                          type="datetime-local"
                          value={startTimeValue}
                          max={formatDateTimeInput(new Date())}
                          onChange={(event) => {
                            setStartTimeValue(event.target.value);
                            setEditError('');
                          }}
                          aria-label="停车开始时间"
                          aria-invalid={Boolean(editError)}
                          className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white outline-none transition-colors focus:border-amber-400/50"
                        />
                        {editError && <p className="mt-2 text-xs text-red-400">{editError}</p>}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="h-10 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.05]"
                          >
                            <X weight="bold" className="w-4 h-4 mr-1.5" />
                            取消
                          </Button>
                          <Button
                            type="button"
                            onClick={handleSaveStartTime}
                            disabled={isSaving}
                            className="h-10 rounded-xl bg-amber-500 text-[#0a0a0b] hover:bg-amber-400"
                          >
                            <Check weight="bold" className="w-4 h-4 mr-1.5" />
                            {isSaving ? '保存中' : '保存并重算'}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-xl py-6 text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-[background-color,transform] duration-300 hover:scale-[1.01]"
                  onClick={onEnd}
                >
                  <Square weight="fill" className="w-5 h-5 mr-2" />
                  结束停车
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

interface ParkingHistoryProps {
  history: ParkingRecord[];
  onClear: () => void;
  onDelete: (id: number) => void;
  expanded: boolean;
  onToggle: () => void;
}

function ParkingHistory({ history, onClear, onDelete, expanded, onToggle }: ParkingHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="border border-white/[0.06] bg-[#141416] overflow-hidden">
        <CardHeader
          className="cursor-pointer hover:bg-white/[0.02] transition-colors border-b border-white/[0.04] py-4"
          onClick={onToggle}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-white font-medium flex items-center gap-2">
              <Clock weight="bold" className="w-4 h-4 text-white/40" />
              历史记录
              <span className="text-sm text-white/30 font-normal">({history.length})</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="text-white/40 hover:text-white hover:bg-white/[0.05] h-8 rounded-lg"
            >
              {expanded ? (
                <CaretUp weight="bold" className="w-4 h-4" />
              ) : (
                <CaretDown weight="bold" className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <div
          style={{
            display: 'grid',
            gridTemplateRows: expanded ? '1fr' : '0fr',
            transition: 'grid-template-rows 250ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="overflow-hidden"
        >
          <div className="min-h-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-white/[0.04]">
                {history.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-white/70">
                        <Clock weight="bold" className="w-3.5 h-3.5 text-white/30" />
                        <span className="font-medium text-sm">{formatDateTime(record.startTime)}</span>
                      </div>
                      {record.endTime && (
                        <p className="text-xs text-white/30 mt-1 pl-6">
                          结束于 {formatDateTime(record.endTime)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium tabular-nums whitespace-nowrap text-amber-400/80">
                        {formatDuration(getParkingDuration(record))}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-[color,background-color,opacity] duration-150"
                        onClick={() => onDelete(record.id!)}
                      >
                        <Trash weight="bold" className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 border-t border-white/[0.04]">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.05] hover:border-white/[0.12] rounded-xl"
                  onClick={onClear}
                >
                  <Trash weight="bold" className="w-4 h-4 mr-2" />
                  清空历史记录
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function ParkingPage() {
  const [activeParking, setActiveParking] = useState<ParkingRecord | null>(null);
  const [history, setHistory] = useState<ParkingRecord[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [active, historyRecords] = await Promise.all([getActiveParking(), getParkingHistory()]);
      setActiveParking(active || null);
      setHistory(historyRecords);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStart = useCallback(async () => {
    await startParking();
    await loadData();
  }, [loadData]);

  const handleEnd = useCallback(async () => {
    if (activeParking?.id) {
      await endParking(activeParking.id);
      await loadData();
    }
  }, [activeParking, loadData]);

  const handleClear = useCallback(async () => {
    await clearParkingHistory();
    await loadData();
  }, [loadData]);

  const handleDelete = useCallback(async (id: number) => {
    await deleteParkingRecord(id);
    await loadData();
  }, [loadData]);

  const handleUpdateStart = useCallback(async (startTime: Date) => {
    if (!activeParking?.id) return;
    await updateParkingStartTime(activeParking.id, startTime);
    await loadData();
  }, [activeParking, loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] relative">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 py-6 sm:py-12 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/10 border-t-amber-400 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] relative">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative max-w-2xl mx-auto px-4 py-6 sm:py-12 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-8 sm:mb-10"
        >
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/50 hover:text-white hover:bg-white/[0.05] rounded-xl"
            >
              <ArrowLeft weight="bold" className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">停车倒计时</h1>
            <p className="text-white/40 mt-1 text-sm">记录停车时长，控制费用</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <ActiveParking
            parking={activeParking}
            onStart={handleStart}
            onEnd={handleEnd}
            onUpdateStart={handleUpdateStart}
          />

          <ParkingHistory
            history={history}
            onClear={handleClear}
            onDelete={handleDelete}
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 py-4 text-center">
          <p className="text-xs text-white/20">
            Powered by <span className="text-white/40 font-medium">zzhpro</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
