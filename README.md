# AI 工具集

一个精心设计的个人效率工具集合，采用现代 Web 技术栈构建，注重用户体验和视觉美感。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## 特性

- **倒数日** - 记录重要日子，支持农历和阳历，每年重复提醒
- **四象限任务看板** - 基于艾森豪威尔矩阵的任务管理，区分重要与紧急
- **停车倒计时** - 简洁的停车计时器，控制停车费用

## 设计理念

- **本地优先** - 数据存储在浏览器 IndexedDB 中，保护隐私，离线可用
- **无需注册** - 打开即用，数据完全由你掌控
- **精致设计** - 每个细节都经过深思熟虑，追求极致的用户体验
- **深色主题** - 精心调校的深色界面，减少视觉疲劳

## 技术栈

- **框架** - React 19 + React Router 7
- **构建工具** - Vite 6
- **语言** - TypeScript 5
- **样式** - Tailwind CSS 4
- **状态管理** - Zustand
- **动画** - Framer Motion
- **数据库** - IndexedDB + Dexie.js
- **UI 组件** - shadcn/ui + Radix UI
- **图标** - Phosphor Icons

## 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd ai-toolkits

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 项目结构

```
src/
├── app/                  # 应用入口与全局配置
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
├── routes/               # 路由页面组件
│   ├── landing/          # 首页
│   ├── reminder/         # 倒数日
│   ├── kanban/           # 任务看板
│   └── parking/          # 停车计时
├── modules/              # 业务模块
│   ├── reminder/
│   ├── kanban/
│   └── ...
├── shared/               # 共享资源
│   ├── components/
│   ├── hooks/
│   └── lib/
└── db/                   # IndexedDB 配置
    ├── schema.ts
    └── stores/
```

## 开发规范

### 组件规范

- 使用函数声明而非箭头函数
- Props 使用解构接收
- 接口命名规范：`组件名 + Props`
- 组件名使用 PascalCase

```tsx
interface UserCardProps {
  userId: string;
  onSelect?: (userId: string) => void;
}

export default function UserCard({ userId, onSelect }: UserCardProps) {
  // ...
}
```

### 样式规范

- 使用 Tailwind CSS 工具类
- 复杂样式使用 `cn()` 工具函数合并
- 自定义颜色通过 CSS 变量定义

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License

---

Powered by [zzhpro](https://github.com/zzhpro)
