// src/routes/parking/ParkingPage.tsx
import { useEffect, useState, useCallback, useRef } from 'react';
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
} from '@/db/stores/parkingStore';
import type { ParkingRecord } from '@/db/schema';

interface ActiveParkingProps {
  parking: ParkingRecord | null;
  onEnd: () => void;
}

function ActiveParking({ parking, onEnd }: ActiveParkingProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!parking) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const updateElapsed = () => {
      setElapsedTime(getParkingDuration(parking));
    };

    updateElapsed();
    intervalRef.current = setInterval(updateElapsed, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [parking]);

  if (!parking) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="mb-4 text-muted-foreground">当前没有停车记录</p>
          <Button size="lg" onClick={startParking}>
            开始停车
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          停车中
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          开始时间：{formatDateTime(parking.startTime)}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">已停时长</p>
          <p className="text-5xl font-bold tabular-nums tracking-tight text-primary">
            {formatDuration(elapsedTime)}
          </p>
        </div>
        <Button size="lg" variant="destructive" className="w-full" onClick={onEnd}>
          结束停车
        </Button>
      </CardContent>
    </Card>
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
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            历史停车记录
            <span className="ml-2 text-sm text-muted-foreground">({history.length})</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
            {expanded ? '收起' : '展开'}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {history.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{formatDateTime(record.startTime)}</p>
                  {record.endTime && (
                    <p className="text-xs text-muted-foreground">
                      结束于 {formatDateTime(record.endTime)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium tabular-nums whitespace-nowrap">
                    {formatDuration(getParkingDuration(record))}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(record.id!)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={onClear}>
            清空历史记录
          </Button>
        </CardContent>
      )}
    </Card>
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
      const [active, historyRecords] = await Promise.all([
        getActiveParking(),
        getParkingHistory(),
      ]);
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

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-md p-4">
        <h1 className="text-2xl font-bold mb-6">停车倒计时</h1>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            加载中...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md p-4 space-y-4">
      <h1 className="text-2xl font-bold">停车倒计时</h1>

      {activeParking ? (
        <ActiveParking parking={activeParking} onEnd={handleEnd} />
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">当前没有停车记录</p>
            <Button size="lg" onClick={handleStart}>
              开始停车
            </Button>
          </CardContent>
        </Card>
      )}

      <ParkingHistory
        history={history}
        onClear={handleClear}
        onDelete={handleDelete}
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      />
    </div>
  );
}
