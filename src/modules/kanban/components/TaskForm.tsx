// src/modules/kanban/components/TaskForm.tsx
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckSquare } from '@phosphor-icons/react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import DateTimePicker from '@/shared/components/DateTimePicker';
import type { Task, QuadrantType } from '@/db/schema';
import { QUADRANT_LABELS } from '../types/task';
import { cn } from '@/shared/lib/utils';

interface TaskFormProps {
  task?: Task;
  defaultQuadrant?: QuadrantType;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    note?: string;
    deadline?: Date;
    quadrant: QuadrantType;
  }) => void;
}

export default function TaskForm({
  task,
  defaultQuadrant = 'important-urgent',
  isOpen,
  onClose,
  onSubmit,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [deadline, setDeadline] = useState('');
  const [quadrant, setQuadrant] = useState<QuadrantType>(defaultQuadrant);
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNote(task.note || '');
      setDeadline(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '');
      setQuadrant(task.quadrant);
    } else {
      setTitle('');
      setNote('');
      setDeadline('');
      setQuadrant(defaultQuadrant);
    }
    setErrors({});
  }, [task, defaultQuadrant, isOpen]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim()) {
        setErrors({ title: '请输入任务标题' });
        return;
      }

      onSubmit({
        title: title.trim(),
        note: note.trim() || undefined,
        deadline: deadline ? new Date(deadline) : undefined,
        quadrant,
      });

      // Reset form
      setTitle('');
      setNote('');
      setDeadline('');
    },
    [title, note, deadline, quadrant, onSubmit]
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-[#141416] border border-white/[0.08] p-5 sm:p-6 shadow-2xl shadow-black/50"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
        >
          <X weight="bold" className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <CheckSquare weight="duotone" className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            {task ? '编辑任务' : '新建任务'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-white/70">
              任务标题
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({});
                }
              }}
              placeholder="输入任务标题"
              className={cn(
                'bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/25 h-11 rounded-xl',
                'focus:border-emerald-500/50 focus:ring-emerald-500/10 focus:ring-1',
                errors.title && 'border-red-500/50'
              )}
            />
            <AnimatePresence>
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-xs text-red-400/80"
                >
                  {errors.title}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-white/70">象限</Label>
            <Select value={quadrant} onValueChange={(v) => setQuadrant(v as QuadrantType)}>
              <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white h-11 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1c] border-white/[0.08]">
                {(Object.keys(QUADRANT_LABELS) as QuadrantType[]).map((q) => (
                  <SelectItem
                    key={q}
                    value={q}
                    className="text-white/70 focus:bg-white/[0.05] focus:text-white"
                  >
                    {QUADRANT_LABELS[q]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-sm text-white/70">
              截止时间
            </Label>
            <DateTimePicker
              value={deadline}
              onChange={setDeadline}
              placeholder="选择截止时间（可选）"
              accentColor="emerald"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm text-white/70">
              备注
            </Label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加备注（可选）"
              className="w-full min-h-[100px] px-4 py-3 text-sm rounded-xl border border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/25 resize-y focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.05] h-11 rounded-xl transition-all duration-200"
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0b] border-0 h-11 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {task ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
