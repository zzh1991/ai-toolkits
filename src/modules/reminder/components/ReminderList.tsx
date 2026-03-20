// src/modules/reminder/components/ReminderList.tsx
import { AnimatePresence } from 'framer-motion';
import ReminderCard from './ReminderCard';
import type { ReminderListProps } from '@/modules/reminder/types/reminder';

interface SectionProps {
  title: string;
  subtitle: string;
  reminders: ReminderListProps['reminders'];
  onEdit: ReminderListProps['onEdit'];
  onDelete: ReminderListProps['onDelete'];
  emptyMessage: string;
}

function Section({ title, subtitle, reminders, onEdit, onDelete, emptyMessage }: SectionProps) {
  if (reminders.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-white/30 text-xs sm:text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 px-2">
        <h2 className="text-base sm:text-lg font-semibold text-white/90">{title}</h2>
        <span className="text-xs sm:text-sm text-white/40">{subtitle}</span>
      </div>
      <div className="space-y-2 sm:space-y-3">
        <AnimatePresence mode="popLayout">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEdit={() => onEdit(reminder)}
              onDelete={() => onDelete(reminder.id!)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ReminderList({ reminders, onEdit, onDelete }: ReminderListProps) {
  const upcoming = reminders.filter((r) => r.days >= 0);
  const past = reminders.filter((r) => r.days < 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      <Section
        title="倒数"
        subtitle="即将到来的重要日子"
        reminders={upcoming}
        onEdit={onEdit}
        onDelete={onDelete}
        emptyMessage="暂无即将到来的纪念日"
      />
      <Section
        title="正数"
        subtitle="已经过去的日子"
        reminders={past}
        onEdit={onEdit}
        onDelete={onDelete}
        emptyMessage="暂无已过去的纪念日"
      />
    </div>
  );
}
