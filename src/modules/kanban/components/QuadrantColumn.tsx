// src/modules/kanban/components/QuadrantColumn.tsx
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import TaskCard from './TaskCard';
import type { Task, QuadrantType } from '@/db/schema';
import { QUADRANT_LABELS, QUADRANT_COLORS } from '../types/task';

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

  const colors = QUADRANT_COLORS[quadrant];
  const label = QUADRANT_LABELS[quadrant];

  return (
    <div className={`flex flex-col h-full rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}>
      {/* Header */}
      <div className={`p-3 ${colors.header}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{label}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onAdd(quadrant)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {/* Stats */}
        <div className="flex items-center gap-3 mt-2 text-xs opacity-80">
          <span>总 {stats.total}</span>
          <span>待办 {stats.uncompleted}</span>
          <span>完成 {stats.completed}</span>
          {stats.todayDue > 0 && (
            <span className="text-red-600 dark:text-red-400 font-medium">
              今日 {stats.todayDue}
            </span>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-0">
        {/* Uncompleted tasks */}
        {uncompleted.length === 0 && completed.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            暂无任务
          </div>
        ) : (
          <>
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

            {/* Completed tasks section */}
            {completed.length > 0 && (
              <div className="pt-2 border-t border-dashed">
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center gap-1 w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  {showCompleted ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  已完成 ({completed.length})
                </button>
                {showCompleted && (
                  <div className="space-y-2 mt-2">
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
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
