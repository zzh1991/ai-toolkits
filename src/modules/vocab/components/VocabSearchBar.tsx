// src/modules/vocab/components/VocabSearchBar.tsx
import { memo } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { CATEGORY_LABELS, LEVEL_LABELS } from '../data/vocabularyData';
import type { VocabLevel, VocabCategory } from '../data/vocabularyData';

interface VocabSearchBarProps {
  searchQuery: string;
  selectedLevel: VocabLevel | '';
  selectedCategory: VocabCategory | '';
  onSearchChange: (query: string) => void;
  onLevelChange: (level: VocabLevel | '') => void;
  onCategoryChange: (category: VocabCategory | '') => void;
}

export default memo(function VocabSearchBar({
  searchQuery,
  selectedLevel,
  selectedCategory,
  onSearchChange,
  onLevelChange,
  onCategoryChange,
}: VocabSearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <MagnifyingGlass
          weight="bold"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none"
        />
        <Input
          type="text"
          placeholder="搜索单词（中英文 / 同义词）"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-10 h-12 bg-[#141416] border-white/[0.06] text-white placeholder:text-white/30 rounded-2xl text-base focus:border-blue-500/50 focus:ring-blue-500/20"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 hover:text-white/70 transition-colors"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={selectedLevel || '__all__'} onValueChange={(v) => onLevelChange(v === '__all__' ? '' : v as VocabLevel)}>
          <SelectTrigger className="w-[140px] h-10 bg-[#141416] border-white/[0.06] text-white rounded-xl text-sm">
            <SelectValue placeholder="全部级别" />
          </SelectTrigger>
          <SelectContent className="bg-[#141416] border-white/[0.08]">
            <SelectItem value="__all__" className="text-white/70 focus:text-white focus:bg-white/5">
              全部级别
            </SelectItem>
            {Object.entries(LEVEL_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-white/70 focus:text-white focus:bg-white/5">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory || '__all__'} onValueChange={(v) => onCategoryChange(v === '__all__' ? '' : v as VocabCategory)}>
          <SelectTrigger className="w-[140px] h-10 bg-[#141416] border-white/[0.06] text-white rounded-xl text-sm">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent className="bg-[#141416] border-white/[0.08]">
            <SelectItem value="__all__" className="text-white/70 focus:text-white focus:bg-white/5">
              全部分类
            </SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-white/70 focus:text-white focus:bg-white/5">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(selectedLevel || selectedCategory) && (
          <button
            onClick={() => {
              onLevelChange('');
              onCategoryChange('');
            }}
            className="h-10 px-4 rounded-xl text-sm text-white/50 hover:text-white/70 border border-white/[0.06] hover:border-white/[0.12] transition-all"
          >
            清除筛选
          </button>
        )}
      </div>
    </div>
  );
});
