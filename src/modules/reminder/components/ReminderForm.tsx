// src/modules/reminder/components/ReminderForm.tsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from '@phosphor-icons/react';
import { cn, getTodayString } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import DatePicker from '@/shared/components/DatePicker';
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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validate()) {
        onSubmit(formData);
      }
    },
    [formData, onSubmit, validate]
  );

  const updateField = useCallback(
    <K extends keyof ReminderFormData>(field: K, value: ReminderFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

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
        onClick={onCancel}
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
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
        >
          <X weight="bold" className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <Calendar weight="duotone" className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            {reminder ? '编辑纪念日' : '新增纪念日'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-white/70">
              事件标题
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="例如：生日、纪念日..."
              className={cn(
                'bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/25 h-11 rounded-xl',
                'focus:border-blue-500/50 focus:ring-blue-500/10 focus:ring-1',
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

          {/* Date Type */}
          <div className="space-y-2">
            <Label className="text-sm text-white/70">日期类型</Label>
            <div className="flex gap-2">
              {(['solar', 'lunar'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField('dateType', type)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    formData.dateType === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70'
                  )}
                >
                  {type === 'solar' ? '阳历' : '农历'}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm text-white/70">日期</Label>
            <DatePicker
              value={formData.date}
              onChange={(value) => updateField('date', value)}
              placeholder="选择日期"
              accentColor="blue"
            />
            <AnimatePresence>
              {errors.date && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-xs text-red-400/80"
                >
                  {errors.date}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Repeating */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03]">
            <Label htmlFor="repeating" className="text-sm text-white/70 cursor-pointer">
              每年重复
            </Label>
            <Switch
              id="repeating"
              checked={formData.isRepeating}
              onCheckedChange={(checked) => updateField('isRepeating', checked)}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          {/* Color Theme */}
          <div className="space-y-2">
            <Label className="text-sm text-white/70">主题颜色</Label>
            <div className="flex gap-2 flex-wrap">
              {CARD_THEMES.map((theme) => (
                <motion.button
                  key={theme.name}
                  type="button"
                  onClick={() => updateField('color', theme.name)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'w-10 h-10 rounded-full transition-all duration-200',
                    formData.color === theme.name
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#141416]'
                      : 'opacity-60 hover:opacity-100'
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
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.05] h-11 rounded-xl transition-all duration-200"
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-400 text-white border-0 h-11 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {reminder ? '保存' : '添加'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
