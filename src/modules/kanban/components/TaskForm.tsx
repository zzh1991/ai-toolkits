// src/modules/kanban/components/TaskForm.tsx
import { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
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
import type { Task, QuadrantType } from '@/db/schema';
import { QUADRANT_LABELS } from '../types/task';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? '编辑任务' : '新建任务'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              任务标题 <span className="text-red-500">*</span>
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
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quadrant">象限</Label>
            <Select value={quadrant} onValueChange={(v) => setQuadrant(v as QuadrantType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(QUADRANT_LABELS) as QuadrantType[]).map((q) => (
                  <SelectItem key={q} value={q}>
                    {QUADRANT_LABELS[q]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">截止时间</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">备注</Label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加备注（可选）"
              className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-transparent resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">
              {task ? '保存' : '创建'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
