// src/modules/reminder/components/ReminderForm.tsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn, getTodayString } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import type { ReminderFormProps, ReminderFormData } from '@/modules/reminder/types/reminder';
import { CARD_THEMES } from '@/shared/constants/colors';

export default function ReminderForm({ reminder, onSubmit, onCancel }: ReminderFormProps) {
  const [formData, setFormData] = useState<ReminderFormData>({
    title: reminder?.title || '',
    date: reminder?.date || getTodayString(),
    dateType: reminder?.dateType || 'solar',
    isRepeating: reminder?.isRepeating || false,
    color: reminder?.color || CARD_THEMES[0].name,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ReminderFormData, string>>>({});

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ReminderFormData, string>> = {};
    if (!formData.title.trim()) {
      newErrors.title = '请输入事件标题';
    }
    if (!formData.date) {
      newErrors.date = '请选择日期';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  }, [formData, onSubmit, validate]);

  const updateField = useCallback(<K extends keyof ReminderFormData>(field: K, value: ReminderFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{
          duration: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#1a1a2e] border border-white/10 p-4 sm:p-6 shadow-2xl"
      >
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
          {reminder ? '编辑纪念日' : '新增纪念日'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Title */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="title" className="text-sm sm:text-base text-white/80">事件标题</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="例如：生日、纪念日..."
              className={cn(
                'bg-white/5 border-white/10 text-white placeholder:text-white/30 h-10 sm:h-11',
                errors.title && 'border-red-500'
              )}
            />
            <AnimatePresence>
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-red-400"
                >
                  {errors.title}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Date Type */}
          <div className="space-y-2">
            <Label className="text-white/80">日期类型</Label>
            <div className="flex gap-2">
              {(['solar', 'lunar'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField('dateType', type)}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
                    formData.dateType === type
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  )}
                >
                  {type === 'solar' ? '阳历' : '农历'}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-white/80">日期</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              className={cn(
                'bg-white/5 border-white/10 text-white',
                'appearance-none',
                errors.date && 'border-red-500'
              )}
            />
          </div>

          {/* Repeating */}
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="repeating" className="text-white/80 cursor-pointer">每年重复</Label>
            <Switch
              id="repeating"
              checked={formData.isRepeating}
              onCheckedChange={(checked) => updateField('isRepeating', checked)}
            />
          </div>

          {/* Color Theme */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-sm sm:text-base text-white/80">主题颜色</Label>
            <div className="flex gap-2 flex-wrap">
              {CARD_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => updateField('color', theme.name)}
                  className={cn(
                    'w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all',
                    formData.color === theme.name
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a2e] scale-110'
                      : 'hover:scale-105'
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
                  }}
                  title={theme.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 h-10 sm:h-11"
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 hover:opacity-90 h-10 sm:h-11"
            >
              {reminder ? '保存' : '添加'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
