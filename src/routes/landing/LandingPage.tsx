import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  CalendarHeart,
  Car,
  Coin,
  Database,
  GraduationCap,
  Sparkle,
  SquaresFour,
} from '@phosphor-icons/react';
import DataTransferDialog from '@/shared/components/DataTransferDialog';

const tools = [
  {
    title: '倒数日',
    shortTitle: '倒数日',
    description: '记住重要日子，也看见期待正在靠近。',
    to: '/reminder',
    icon: CalendarHeart,
    iconClass: 'bg-blue-500/12 text-blue-300',
    glowClass: 'group-hover:bg-blue-500/10',
    layoutClass: 'lg:col-span-7',
  },
  {
    title: '四象限任务',
    shortTitle: '任务',
    description: '先做重要的事，把精力放在真正需要的地方。',
    to: '/kanban',
    icon: SquaresFour,
    iconClass: 'bg-emerald-500/12 text-emerald-300',
    glowClass: 'group-hover:bg-emerald-500/10',
    layoutClass: 'lg:col-span-5',
  },
  {
    title: '停车计时',
    shortTitle: '停车',
    description: '随手开始计时，停车多久一眼就知道。',
    to: '/parking',
    icon: Car,
    iconClass: 'bg-amber-500/12 text-amber-300',
    glowClass: 'group-hover:bg-amber-500/10',
    layoutClass: 'lg:col-span-4',
  },
  {
    title: '黄金价格',
    shortTitle: '金价',
    description: '查看价格和近期走势，辅助日常判断。',
    to: '/gold',
    icon: Coin,
    iconClass: 'bg-yellow-500/12 text-yellow-200',
    glowClass: 'group-hover:bg-yellow-500/10',
    layoutClass: 'lg:col-span-4',
  },
  {
    title: '英语词汇',
    shortTitle: '词汇',
    description: '查词、听发音，陪孩子轻松积累常用词。',
    to: '/vocab',
    icon: GraduationCap,
    iconClass: 'bg-violet-500/12 text-violet-300',
    glowClass: 'group-hover:bg-violet-500/10',
    layoutClass: 'col-span-2 sm:col-span-1 lg:col-span-4',
  },
];

interface ToolCardProps {
  tool: (typeof tools)[number];
  index: number;
}

function ToolCard({ tool, index }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12 + index * 0.055, ease: [0.16, 1, 0.3, 1] }}
      className={tool.layoutClass}
    >
      <Link
        to={tool.to}
        className="group relative flex min-h-40 h-full flex-col justify-between overflow-hidden rounded-[1.4rem] bg-[#141416] p-4 sm:min-h-52 sm:p-6 border border-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      >
        <div
          className={`absolute -right-10 -top-12 h-32 w-32 rounded-full bg-transparent blur-3xl transition-colors duration-500 ${tool.glowClass}`}
        />

        <div className="relative flex items-start justify-between gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${tool.iconClass}`}>
            <Icon weight="duotone" className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <ArrowUpRight
            weight="bold"
            className="h-4 w-4 text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70"
          />
        </div>

        <div className="relative mt-6">
          <h2 className="text-lg font-semibold tracking-tight text-white sm:text-2xl">{tool.title}</h2>
          <p className="mt-2 hidden max-w-sm text-sm leading-relaxed text-white/40 sm:block">
            {tool.description}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

export default function LandingPage() {
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#0a0a0b] noise-overlay">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-blue-500/[0.055] blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-emerald-500/[0.035] blur-[120px]" />
      </div>

      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        aria-label="主导航"
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
      >
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0b]/85 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="flex h-14 items-center justify-between px-4 sm:px-5">
            <Link to="/" className="group flex items-center gap-2.5" aria-label="AI 工具集首页">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#0a0a0b] transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
                <Sparkle weight="fill" className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-white sm:text-base">AI 工具集</span>
            </Link>

            <div className="hidden items-center gap-0.5 sm:flex">
              {tools.map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="rounded-lg px-3 py-2 text-sm text-white/50 transition-colors duration-200 hover:bg-white/[0.05] hover:text-white"
                >
                  {tool.shortTitle}
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsDataDialogOpen(true)}
              aria-label="打开数据管理"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/45 transition-all duration-200 hover:bg-white/[0.05] hover:text-white active:scale-95"
            >
              <Database weight="bold" className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-1 overflow-x-auto border-t border-white/[0.05] px-2 py-2 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="flex min-w-fit items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-white/55 transition-colors active:bg-white/[0.07] active:text-white"
                >
                  <Icon weight="bold" className="h-3.5 w-3.5" />
                  {tool.shortTitle}
                </Link>
              );
            })}
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-36 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
        <section aria-labelledby="landing-title">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-9 max-w-3xl sm:mb-12"
          >
            <p className="mb-5 text-sm font-medium tracking-wide text-white/35">简单工具，解决具体问题</p>
            <h1
              id="landing-title"
              className="max-w-2xl text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
            >
              少一点忙乱，
              <span className="text-white/35">多一点从容。</span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/45 sm:mt-6 sm:text-lg">
              五个无需注册、打开即用的小工具。数据留在本地，日常安排更轻松。
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
            {tools.map((tool, index) => (
              <ToolCard key={tool.to} tool={tool} index={index} />
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.05] px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs text-white/25">
          <span>数据仅保存在你的设备上</span>
          <span>zzhpro</span>
        </div>
      </footer>

      <AnimatePresence>
        {isDataDialogOpen && (
          <DataTransferDialog
            isOpen={isDataDialogOpen}
            onClose={() => setIsDataDialogOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
