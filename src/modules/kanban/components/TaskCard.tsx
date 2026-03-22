// src/modules/kanban/components/TaskCard.tsx
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, Clock, ChevronDown, ChevronUp, Trash2, Edit2 } from 'lucide-react';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';
import type { Task } from '@/db/schema';

interface TaskCardProps {
  task: Task;
  isCompleted?: boolean;
  onToggleComplete: (id: number, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({
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

  return (
    <div
      className={`group relative rounded-lg border bg-white dark:bg-gray-900 p-3 transition-all hover:shadow-md ${
        isCompleted ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.isCompleted}
          onCheckedChange={handleToggle}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-medium leading-tight text-gray-900 dark:text-gray-100 ${
                isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''
              }`}
            >
              {task.title}
            </h4>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                onClick={handleEdit}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Deadline or Completed time */}
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {isCompleted ? (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                完成于 {task.completedAt ? formatDate(task.completedAt) : '-'}
              </span>
            ) : task.deadline ? (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                截止 {formatDate(task.deadline)}
              </span>
            ) : null}
          </div>

          {/* Expandable details */}
          {task.note && (
            <div className="mt-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {showDetails ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    收起详情
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    查看备注
                  </>
                )}
              </button>
              {showDetails && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded p-2">
                  <p className="whitespace-pre-wrap">{task.note}</p>
                  <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    创建于 {formatFullDate(task.createdAt)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Show created time if no note */}
          {!task.note && showDetails && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <button
                onClick={() => setShowDetails(false)}
                className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <ChevronUp className="h-3 w-3" />
                收起
              </button>
              <p className="mt-2 text-gray-600 dark:text-gray-300">创建于 {formatFullDate(task.createdAt)}</p>
            </div>
          )}

          {!task.note && !showDetails && (
            <button
              onClick={() => setShowDetails(true)}
              className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <ChevronDown className="h-3 w-3" />
              查看创建时间
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
