// src/routes/reminder/ReminderPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowLeft } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/20 to-transparent blur-3xl rounded-full" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-fuchsia-500/20 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="relative max-w-2xl mx-auto px-4 py-6 sm:py-12 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-6 sm:mb-10 gap-4"
        >
          <div className="flex items-center gap-3">
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">倒数日</h1>
              <p className="text-white/50 mt-1 text-sm sm:text-base">记录每一个重要的日子</p>
            </div>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-4 sm:px-6 backdrop-blur-xl whitespace-nowrap"
          >
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">新增</span>
            <span className="sm:hidden">添加</span>
          </Button>
        </motion.div>

        {/* Reminder List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : reminders.length === 0 ? (
            <div className="text-center py-12 sm:py-20 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white/30" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-white/80 mb-2">还没有纪念日</h3>
              <p className="text-white/40 text-sm mb-4 sm:mb-6">点击右上角按钮添加你的第一个纪念日</p>
              <Button
                onClick={handleAdd}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加纪念日
              </Button>
            </div>
          ) : (
            <ReminderList
              reminders={reminders}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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
      <AnimatePresence>
        {isFormOpen && (
          <ReminderForm
            reminder={editingReminder}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
