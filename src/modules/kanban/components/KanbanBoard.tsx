// src/modules/kanban/components/KanbanBoard.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/20 to-transparent blur-3xl rounded-full" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-fuchsia-500/20 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-12 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-10 gap-4"
        >
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8" />
                四象限任务看板
              </h1>
              <p className="text-white/50 mt-1 text-sm sm:text-base">
                按重要性和紧急程度管理你的任务
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleAdd('important-urgent')}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-4 sm:px-6 backdrop-blur-xl whitespace-nowrap"
          >
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">新建任务</span>
            <span className="sm:hidden">添加</span>
          </Button>
        </motion.div>

        {/* Global Stats */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8"
        >
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-white/50 text-xs uppercase tracking-wider">总任务</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-white/50 text-xs uppercase tracking-wider">待办</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.uncompleted}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-white/50 text-xs uppercase tracking-wider">已完成</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.completed}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-white/50 text-xs uppercase tracking-wider">今日截止</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{stats.todayDue}</p>
          </div>
        </motion.div>

        {/* Kanban Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex-1"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
          <p className="text-xs sm:text-sm text-white/30">
            Powered By <span className="text-white/50 font-medium">zzhpro</span>
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
