# AI 工具集

少一点忙乱，多一点从容。

一个本地优先的个人效率工具集合。无需注册，打开即用，用简洁的界面处理日程、任务、停车、金价和英语学习中的具体问题。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

![AI 工具集宣传海报](docs/assets/ai-toolkits-promo-poster.png)

## 工具一览

| 工具 | 主要能力 |
| --- | --- |
| 倒数日 | 记录生日、纪念日和重要节点，支持公历、农历与每年重复 |
| 四象限任务 | 按重要/紧急程度组织任务，支持备注、截止时间和完成状态 |
| 停车计时 | 实时显示停车时长，支持结束停车后查看历史，也可手动校正开始时间并重新计算 |
| 黄金价格 | 查看黄金价格、近期走势和基于指标生成的辅助建议 |
| 英语词汇 | 覆盖幼儿园至小学常用词汇，支持中英文搜索、同义词关联与在线发音 |

## 为什么做这个项目

- **本地优先**：倒数日、任务、停车记录和词汇数据保存在浏览器 IndexedDB 中。
- **无需账号**：没有注册和登录流程，日常工具打开即可使用。
- **数据可控**：首页提供数据管理入口，支持本地数据导入与导出。
- **移动端友好**：首页提供工具快捷导航，主要页面针对手机尺寸做了响应式适配。
- **一致体验**：深色视觉系统、清晰的功能配色和克制的动效贯穿整个应用。

> 金价查询和在线发音等联网能力需要可用的网络连接；其余本地数据不依赖后端服务。

## 技术栈

- React 19 + React Router 7
- TypeScript 5
- Vite 8
- Tailwind CSS 4
- Zustand
- IndexedDB + Dexie.js
- shadcn/ui + Radix UI
- Framer Motion
- Phosphor Icons
- lunar-typescript

## 快速开始

项目使用 `pnpm` 管理依赖。

```bash
# 安装依赖
pnpm install

# 启动本地开发服务
pnpm dev

# 生产构建
pnpm build

# 预览生产构建
pnpm preview
```

默认开发地址以终端中 Vite 输出的 URL 为准。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 执行 TypeScript 检查并构建生产版本 |
| `pnpm lint` | 运行 ESLint 代码检查 |
| `pnpm preview` | 本地预览生产构建 |
| `pnpm update-gold` | 更新项目内的黄金历史数据 |

## 项目结构

```text
ai-toolkits/
├── public/                     # 静态资源
├── docs/assets/                # README 与文档图片
├── src/
│   ├── app/                    # 应用入口与路由配置
│   ├── routes/
│   │   ├── landing/            # 首页与工具导航
│   │   ├── reminder/           # 倒数日
│   │   ├── kanban/             # 四象限任务
│   │   ├── parking/            # 停车计时
│   │   ├── gold/               # 黄金价格
│   │   └── vocab/              # 英语词汇
│   ├── modules/                # 各工具的组件、状态与业务逻辑
│   ├── shared/                 # 通用组件、日期选择器和工具函数
│   └── db/                     # Dexie Schema 与数据访问层
├── package.json
└── vite.config.ts
```

## 数据与隐私

应用不需要独立后端，核心个人数据保存在当前浏览器的 IndexedDB 中。清理浏览器站点数据可能会删除本地记录，建议在更换设备、浏览器或清理数据前先通过首页的数据管理功能导出备份。

## 浏览器支持

建议使用支持 IndexedDB 和现代 CSS 的最新版 Chrome、Edge、Firefox 或 Safari。

## 许可证

MIT License

---

Built by [zzhpro](https://github.com/zzhpro)
