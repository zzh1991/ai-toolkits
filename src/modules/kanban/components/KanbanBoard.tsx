// src/modules/kanban/components/KanbanBoard.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Plus, SquaresFour, ArrowLeft } from '@phosphor-icons/react';
import { Button } from '@/shared/components/ui/button';
import QuadrantColumn from './QuadrantColumn';
import TaskForm from './TaskForm';
import { useTaskStore } from '../stores/taskStore';
import type { Task, QuadrantType } from '@/db/schema';

const QUADRANT_ORDER: QuadrantType[] = [
  'important-urgent',
  'important-not-urgent',
  'not-important-urgent',
  'not-important-not-urgent',
];

export default function KanbanBoard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [defaultQuadrant, setDefaultQuadrant] = useState<QuadrantType>('important-urgent');

  const {
    tasks,
    stats,
    quadrantStats,
    isLoading,
    fetchTasks,
    fetchStats,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  } = useTaskStore();

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const handleAdd = useCallback((quadrant: QuadrantType) => {
    setDefaultQuadrant(quadrant);
    setEditingTask(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setDefaultQuadrant(task.quadrant);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('确定要删除这个任务吗？')) {
      await deleteTask(id);
    }
  }, [deleteTask]);

  const handleSubmit = useCallback(
    async (data: {
      title: string;
      note?: string;
      deadline?: Date;
      quadrant: QuadrantType;
    }) => {
      setIsFormOpen(false);

      if (editingTask?.id) {
        await updateTask(editingTask.id, data);
      } else {
        await addTask({
          ...data,
          createdAt: new Date(),
          isCompleted: false,
        });
      }
      setEditingTask(undefined);
    },
    [editingTask, addTask, updateTask]
  );

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  }, []);

  const handleToggleComplete = useCallback(
    async (id: number, isCompleted: boolean) => {
      await toggleComplete(id, isCompleted);
    },
    [toggleComplete]
  );

  const tasksByQuadrant = useMemo(() => {
    return {
      'important-urgent': tasks.filter((t) => t.quadrant === 'important-urgent'),
      'important-not-urgent': tasks.filter((t) => t.quadrant === 'important-not-urgent'),
      'not-important-urgent': tasks.filter((t) => t.quadrant === 'not-important-urgent'),
      'not-important-not-urgent': tasks.filter((t) => t.quadrant === 'not-important-not-urgent'),
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] relative">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-teal-500/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-12 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: 'transform, opacity' }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-10 gap-4"
        >
          <div className="flex items-center gap-4">
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
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight flex items-center gap-2.5">
                <SquaresFour weight="duotone" className="w-7 h-7 text-emerald-400" />
                四象限任务看板
              </h1>
              <p className="text-white/40 mt-1 text-sm sm:text-base">
                按重要性和紧急程度管理你的任务
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleAdd('important-urgent')}
            className="bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0b] rounded-full px-4 sm:px-5 py-5 text-sm font-medium whitespace-nowrap transition-[background-color,transform] duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus weight="bold" className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">新建任务</span>
          </Button>
        </motion.div>

        {/* Global Stats */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          style={{ willChange: 'transform, opacity' }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8"
        >
          {[
            { label: '总任务', value: stats.total, color: 'text-white' },
            { label: '待办', value: stats.uncompleted, color: 'text-amber-400' },
            { label: '已完成', value: stats.completed, color: 'text-emerald-400' },
            { label: '今日截止', value: stats.todayDue, color: 'text-red-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#141416] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.1] transition-colors duration-200"
            >
              <p className="text-white/30 text-xs font-medium tracking-wide mb-1.5">{stat.label}</p>
              <p className={`text-2xl sm:text-3xl font-semibold tabular-nums ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Kanban Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          style={{ willChange: 'opacity' }}
          className="flex-1"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/10 border-t-emerald-400 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {QUADRANT_ORDER.map((quadrant) => (
                <QuadrantColumn
                  key={quadrant}
                  quadrant={quadrant}
                  tasks={tasksByQuadrant[quadrant]}
                  stats={quadrantStats[quadrant]}
                  onAdd={handleAdd}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 py-4 text-center">
          <p className="text-xs text-white/20">
            Powered by <span className="text-white/40 font-medium">zzhpro</span>
          </p>
        </footer>
      </div>

      {/* Form Modal */}
      <TaskForm
        task={editingTask}
        defaultQuadrant={defaultQuadrant}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
