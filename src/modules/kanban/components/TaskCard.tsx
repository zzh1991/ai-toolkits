// src/modules/kanban/components/TaskCard.tsx
import { memo, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  Calendar,
  CaretDown,
  CaretUp,
  Trash,
  PencilSimple,
  CheckCircle,
} from '@phosphor-icons/react';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { useMotionTransition, motionTransitions } from '@/shared/lib/motion';
import type { Task } from '@/db/schema';

interface TaskCardProps {
  task: Task;
  isCompleted?: boolean;
  onToggleComplete: (id: number, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default memo(function TaskCard({
  task,
  isCompleted = false,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = useCallback(() => {
    onToggleComplete(task.id!, !task.isCompleted);
  }, [task.id, task.isCompleted, onToggleComplete]);

  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [task, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(task.id!);
  }, [task.id, onDelete]);

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MM-dd HH:mm', { locale: zhCN });
  };

  const formatFullDate = (date: Date) => {
    return format(new Date(date), 'yyyy-MM-dd HH:mm', { locale: zhCN });
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.isCompleted;
  const transition = useMotionTransition(motionTransitions.entrance);

  return (
    <motion.div
      layout
      layoutId={`task-${task.id}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
      transition={{
        ...transition,
        layout: { type: 'spring', stiffness: 500, damping: 50 },
      }}
      style={{ willChange: 'transform, opacity' }}
      className={`group relative rounded-xl border transition-[border-color,background-color] duration-200 ${
        isCompleted
          ? 'bg-white/[0.02] border-white/[0.04] opacity-50'
          : 'bg-[#1a1a1c] border-white/[0.06] hover:border-white/[0.1]'
      }`}
    >
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.isCompleted}
            onCheckedChange={handleToggle}
            className={`mt-0.5 border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors duration-150`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4
                className={`text-sm font-medium leading-tight transition-colors duration-200 ${
                  isCompleted ? 'line-through text-white/30' : 'text-white/80'
                }`}
              >
                {task.title}
              </h4>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-[color,background-color,transform] duration-150 active:scale-95"
                  style={{ willChange: 'transform' }}
                  onClick={handleEdit}
                >
                  <PencilSimple weight="bold" className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-[color,background-color,transform] duration-150 active:scale-95"
                  style={{ willChange: 'transform' }}
                  onClick={handleDelete}
                >
                  <Trash weight="bold" className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Deadline or Completed time */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              {isCompleted ? (
                <span className="flex items-center gap-1.5 text-white/30">
                  <CheckCircle weight="fill" className="h-3.5 w-3.5 text-emerald-400/60" />
                  完成于 {task.completedAt ? formatDate(task.completedAt) : '-'}
                </span>
              ) : task.deadline ? (
                <span
                  className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-400/80' : 'text-white/40'}`}
                >
                  <Calendar weight="bold" className={`h-3.5 w-3.5 ${isOverdue ? 'text-red-400' : ''}`} />
                  {isOverdue ? '已逾期 ' : '截止 '}
                  {formatDate(task.deadline)}
                </span>
              ) : null}
            </div>

            {/* Expandable details - Using t-acc accordion transition */}
            {task.note && (
              <div className="t-acc mt-3" data-open={showDetails}>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="t-acc-head flex items-center gap-1 text-xs text-white/30 hover:text-white/50 transition-colors py-1"
                  aria-expanded={showDetails}
                >
                  <span className="t-icon-swap" data-state={showDetails ? 'b' : 'a'}>
                    <span className="t-icon" data-icon="a">
                      <CaretDown weight="bold" className="h-3 w-3" />
                    </span>
                    <span className="t-icon" data-icon="b">
                      <CaretUp weight="bold" className="h-3 w-3" />
                    </span>
                  </span>
                  {showDetails ? '收起详情' : '查看备注'}
                </button>
                <div className="t-acc-panel">
                  <div className="t-acc-panel-inner mt-2 text-xs text-white/60 bg-white/[0.03] rounded-lg p-3 border border-white/[0.06]">
                    <p className="whitespace-pre-wrap leading-relaxed">{task.note}</p>
                    <p className="mt-3 text-white/30">创建于 {formatFullDate(task.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Show created time if no note - Using t-acc accordion transition */}
            {!task.note && (
              <div className="t-acc mt-2" data-open={showDetails}>
                <div className="t-acc-panel">
                  <div className="t-acc-panel-inner overflow-hidden">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="flex items-center gap-1 text-xs text-white/30 hover:text-white/50 transition-colors py-1"
                    >
                      <span className="t-icon-swap" data-state={showDetails ? 'b' : 'a'}>
                        <span className="t-icon" data-icon="a">
                          <CaretDown weight="bold" className="h-3 w-3" />
                        </span>
                        <span className="t-icon" data-icon="b">
                          <CaretUp weight="bold" className="h-3 w-3" />
                        </span>
                      </span>
                      收起
                    </button>
                    <p className="mt-2 text-xs text-white/25">创建于 {formatFullDate(task.createdAt)}</p>
                  </div>
                </div>
                {!showDetails && (
                  <button
                    onClick={() => setShowDetails(true)}
                    className="flex items-center gap-1 mt-2 text-xs text-white/30 hover:text-white/50 transition-colors"
                  >
                    <span className="t-icon-swap" data-state={showDetails ? 'b' : 'a'}>
                      <span className="t-icon" data-icon="a">
                        <CaretDown weight="bold" className="h-3 w-3" />
                      </span>
                      <span className="t-icon" data-icon="b">
                        <CaretUp weight="bold" className="h-3 w-3" />
                      </span>
                    </span>
                    查看详情
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
