// src/shared/constants/colors.ts
export interface ColorTheme {
  name: string;
  from: string;
  to: string;
  bg: string;
}

export const CARD_THEMES: ColorTheme[] = [
  { name: '梦幻紫', from: '#8B5CF6', to: '#A78BFA', bg: 'rgba(139, 92, 246, 0.15)' },
  { name: '天空蓝', from: '#3B82F6', to: '#60A5FA', bg: 'rgba(59, 130, 246, 0.15)' },
  { name: '薄荷绿', from: '#10B981', to: '#34D399', bg: 'rgba(16, 185, 129, 0.15)' },
  { name: '珊瑚橙', from: '#F97316', to: '#FB923C', bg: 'rgba(249, 115, 22, 0.15)' },
  { name: '玫瑰粉', from: '#EC4899', to: '#F472B6', bg: 'rgba(236, 72, 153, 0.15)' },
  { name: '日落红', from: '#EF4444', to: '#F87171', bg: 'rgba(239, 68, 68, 0.15)' },
];

export const DEFAULT_THEME = CARD_THEMES[0];
