// src/modules/kanban/components/QuadrantColumn.tsx
import { useState, useMemo } from 'react';
import { Plus, CaretDown, CaretUp } from '@phosphor-icons/react';
import { Button } from '@/shared/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import type { Task, QuadrantType } from '@/db/schema';
import { QUADRANT_LABELS } from '../types/task';

interface QuadrantColumnProps {
  quadrant: QuadrantType;
  tasks: Task[];
  stats: {
    total: number;
    completed: number;
    uncompleted: number;
    todayDue: number;
  };
  onAdd: (quadrant: QuadrantType) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, isCompleted: boolean) => void;
}

export default function QuadrantColumn({
  quadrant,
  tasks,
  stats,
  onAdd,
  onEdit,
  onDelete,
  onToggleComplete,
}: QuadrantColumnProps) {
  const [showCompleted, setShowCompleted] = useState(false);

  const { uncompleted, completed } = useMemo(() => {
    const uncompleted = tasks
      .filter((t) => !t.isCompleted)
      .sort((a, b) => {
        // Sort by deadline (ascending), tasks without deadline go last
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });

    const completed = tasks
      .filter((t) => t.isCompleted)
      .sort((a, b) => {
        // Sort by completedAt (descending)
        if (!a.completedAt) return 1;
        if (!b.completedAt) return -1;
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      });

    return { uncompleted, completed };
  }, [tasks]);

  const label = QUADRANT_LABELS[quadrant];

  // Get quadrant-specific accent colors - refined palette
  const getAccentStyles = () => {
    switch (quadrant) {
      case 'important-urgent':
        return {
          gradient: 'from-red-500 to-rose-500',
          border: 'border-red-500/30',
          bg: 'bg-red-500/[0.03]',
        };
      case 'important-not-urgent':
        return {
          gradient: 'from-blue-500 to-indigo-500',
          border: 'border-blue-500/30',
          bg: 'bg-blue-500/[0.03]',
        };
      case 'not-important-urgent':
        return {
          gradient: 'from-amber-500 to-orange-500',
          border: 'border-amber-500/30',
          bg: 'bg-amber-500/[0.03]',
        };
      case 'not-important-not-urgent':
        return {
          gradient: 'from-slate-500 to-zinc-500',
          border: 'border-slate-500/30',
          bg: 'bg-slate-500/[0.03]',
        };
    }
  };

  const accent = getAccentStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col h-full rounded-2xl border border-white/[0.06] ${accent.bg} backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-white/[0.1]`}
    >
      {/* Header */}
      <div className="relative p-4">
        {/* Gradient accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent.gradient}`} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-sm text-white/90">{label}</h3>
            {stats.todayDue > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-medium border border-red-500/20">
                今日 {stats.todayDue}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05]"
            onClick={() => onAdd(quadrant)}
          >
            <Plus weight="bold" className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-white/30">总</span>
            <span className="text-white/60 font-medium tabular-nums">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/30">待办</span>
            <span className="text-amber-400/80 font-medium tabular-nums">{stats.uncompleted}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/30">完成</span>
            <span className="text-emerald-400/80 font-medium tabular-nums">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-0">
        {/* Uncompleted tasks */}
        {uncompleted.length === 0 && completed.length === 0 ? (
          <div className="text-center py-8 text-sm text-white/20">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Plus weight="bold" className="w-5 h-5 text-white/20" />
            </div>
            暂无任务
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {uncompleted.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isCompleted={false}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>

            {/* Completed tasks section */}
            {completed.length > 0 && (
              <div className="pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center gap-1 w-full text-xs text-white/30 hover:text-white/50 transition-colors py-2"
                >
                  {showCompleted ? (
                    <CaretUp weight="bold" className="h-3 w-3" />
                  ) : (
                    <CaretDown weight="bold" className="h-3 w-3" />
                  )}
                  已完成 ({completed.length})
                </button>
                <AnimatePresence>
                  {showCompleted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 mt-2"
                    >
                      {completed.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          isCompleted={true}
                          onToggleComplete={onToggleComplete}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
