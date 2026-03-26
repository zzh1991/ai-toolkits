// src/routes/reminder/ReminderPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowLeft, Sparkle, CalendarHeart } from '@phosphor-icons/react';
import { useReminderStore } from '@/modules/reminder/stores/reminderStore';
import ReminderList from '@/modules/reminder/components/ReminderList';
import ReminderForm from '@/modules/reminder/components/ReminderForm';
import { Button } from '@/shared/components/ui/button';
import type { Reminder } from '@/db/schema';
import type { ReminderFormData } from '@/modules/reminder/types/reminder';

export default function ReminderPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);

  const {
    reminders,
    isLoading,
    fetchReminders,
    addReminder,
    updateReminder,
    deleteReminder,
  } = useReminderStore();

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleAdd = useCallback(() => {
    setEditingReminder(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('确定要删除这个纪念日吗？')) {
      await deleteReminder(id);
    }
  }, [deleteReminder]);

  const handleSubmit = useCallback((data: ReminderFormData) => {
    setIsFormOpen(false);
    setEditingReminder(undefined);

    if (editingReminder?.id) {
      updateReminder(editingReminder.id, data);
    } else {
      addReminder({
        ...data,
        createdAt: new Date(),
      });
    }
  }, [editingReminder, addReminder, updateReminder]);

  const handleCancel = useCallback(() => {
    setIsFormOpen(false);
    setEditingReminder(undefined);
  }, []);

  const upcomingCount = reminders.filter((r) => r.days >= 0).length;
  const pastCount = reminders.filter((r) => r.days < 0).length;

  return (
    <div className="min-h-screen bg-[#0a0a0b] relative">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative max-w-2xl mx-auto px-4 py-6 sm:py-12 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-8 sm:mb-10 gap-4"
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
              <div className="flex items-center gap-2.5 mb-1">
                <CalendarHeart weight="duotone" className="w-5 h-5 text-blue-400" />
                <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">倒数日</h1>
              </div>
              <p className="text-white/40 text-sm">记录每一个重要的日子</p>
            </div>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-400 text-white rounded-full px-4 sm:px-5 py-5 text-sm font-medium whitespace-nowrap transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus weight="bold" className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">新增</span>
          </Button>
        </motion.div>

        {/* Stats Summary */}
        {!isLoading && reminders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid grid-cols-3 gap-3 mb-6 sm:mb-8"
          >
            <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-4 text-center">
              <p className="text-white/30 text-xs font-medium tracking-wide mb-1.5">总数</p>
              <p className="text-2xl font-semibold text-white tabular-nums">{reminders.length}</p>
            </div>
            <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-4 text-center">
              <p className="text-white/30 text-xs font-medium tracking-wide mb-1.5">倒数</p>
              <p className="text-2xl font-semibold text-emerald-400 tabular-nums">{upcomingCount}</p>
            </div>
            <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-4 text-center">
              <p className="text-white/30 text-xs font-medium tracking-wide mb-1.5">正数</p>
              <p className="text-2xl font-semibold text-blue-400 tabular-nums">{pastCount}</p>
            </div>
          </motion.div>
        )}

        {/* Reminder List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/10 border-t-blue-400 rounded-full animate-spin" />
            </div>
          ) : reminders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 sm:py-24 px-4"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#141416] border border-white/[0.06] flex items-center justify-center">
                <Sparkle weight="duotone" className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-lg font-medium text-white/80 mb-2">还没有纪念日</h3>
              <p className="text-white/40 text-sm mb-8">点击右上角按钮添加你的第一个纪念日</p>
              <Button
                onClick={handleAdd}
                className="bg-blue-500 hover:bg-blue-400 text-white rounded-full px-6 py-5 text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus weight="bold" className="w-4 h-4 mr-2" />
                添加纪念日
              </Button>
            </motion.div>
          ) : (
            <ReminderList reminders={reminders} onEdit={handleEdit} onDelete={handleDelete} />
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
      <AnimatePresence>
        {isFormOpen && (
          <ReminderForm reminder={editingReminder} onSubmit={handleSubmit} onCancel={handleCancel} />
        )}
      </AnimatePresence>
    </div>
  );
}
