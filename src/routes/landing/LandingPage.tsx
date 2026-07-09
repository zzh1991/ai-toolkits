// src/routes/landing/LandingPage.tsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Lightning,
  Shield,
  Heart,
  Sparkle,
  SquaresFour,
  CalendarHeart,
  Car,
  Database,
  Coin,
} from '@phosphor-icons/react';
import { Button } from '@/shared/components/ui/button';
import DataTransferDialog from '@/shared/components/DataTransferDialog';

// Performance optimized: use transform instead of layout-triggering properties
const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

interface ToolCardProps {
  title: string;
  subtitle: string;
  description: string;
  to: string;
  icon: React.ReactNode;
  gradient: string;
  index: number;
}

function ToolCard({ title, subtitle, description, to, icon, gradient, index }: ToolCardProps) {
  const isEven = index % 2 === 0;
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  // Card tilt effect
  useEffect(() => {
    const tilt = tiltRef.current;
    const card = cardRef.current;
    if (!tilt || !card) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const MAX = 14; // peak tilt in degrees

    function reset() {
      if (!tilt || !card) return;
      tilt.classList.remove('is-hover');
      card.classList.remove('is-tilting');
      card.style.setProperty('--tilt-rx', '0deg');
      card.style.setProperty('--tilt-ry', '0deg');
    }

    function track(e: PointerEvent) {
      if (!tilt || !card) return;
      if (reduce.matches) return;
      const r = tilt.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      tilt.classList.add('is-hover');
      card.classList.add('is-tilting');
      card.style.setProperty('--tilt-ry', `${(px - 0.5) * MAX}deg`);
      card.style.setProperty('--tilt-rx', `${(0.5 - py) * MAX}deg`);
      card.style.setProperty('--tilt-gx', `${px * 100}%`);
      card.style.setProperty('--tilt-gy', `${py * 100}%`);
    }

    tilt.addEventListener('pointermove', track);
    tilt.addEventListener('pointerleave', () => {
      reset();
    });

    return () => {
      tilt.removeEventListener('pointermove', track);
      tilt.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08
      }}
      style={{ willChange: 'transform, opacity' }}
      className="group relative t-tilt"
      ref={tiltRef}
    >
      <div
        ref={cardRef}
        className={`t-tilt-card relative overflow-hidden rounded-3xl bg-[#141416] border border-white/[0.06] transition-all duration-500 hover:border-white/[0.12] hover:shadow-2xl hover:shadow-black/40 ${
          isEven ? '' : ''
        }`}
      >
        <div className="t-tilt-glare" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className={`flex flex-col lg:flex-row ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          {/* Content Side */}
          <div className="flex-1 p-8 lg:p-12 xl:p-16 relative">
            <div
              className="transition-opacity duration-500"
            >
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} text-white/90 mb-6 border border-white/10`}
              >
                {icon}
                {subtitle}
              </span>

              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-white tracking-tight mb-4 text-balance">
                {title}
              </h2>

              <p className="text-base lg:text-lg text-white/50 leading-relaxed mb-8 max-w-md">
                {description}
              </p>

              <Link to={to}>
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${gradient} text-white border-0 rounded-full px-6 py-5 text-sm font-medium group/btn shadow-lg shadow-black/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  开始使用
                  <ArrowRight
                    weight="bold"
                    className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Side */}
          <div className="flex-1 relative min-h-[280px] lg:min-h-[400px]">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-15 transition-opacity duration-500`}
            />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div
                className="relative w-full h-full transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                style={{ willChange: 'transform' }}
              >
                {/* Abstract UI representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Glow effect */}
                    <div
                      className={`absolute -inset-20 bg-gradient-to-r ${gradient} opacity-20 blur-3xl rounded-full`}
                    />
                    {/* Icon */}
                    <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                      <div className="text-white/80 scale-150">{icon}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false);

  const tools = [
    {
      title: '倒数日',
      subtitle: '纪念日管理',
      description:
        '记录生命中每一个重要的日子。生日、纪念日、考试倒计时...用优雅的方式追踪时间的流逝，让每一个特殊时刻都不会被遗忘。',
      to: '/reminder',
      icon: <CalendarHeart weight="fill" className="w-4 h-4" />,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: '四象限任务看板',
      subtitle: '任务管理',
      description:
        '基于艾森豪威尔矩阵的任务管理工具。区分重要与紧急，合理安排时间，提升工作效率，让每一天都过得充实而有意义。',
      to: '/kanban',
      icon: <SquaresFour weight="fill" className="w-4 h-4" />,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: '停车倒计时',
      subtitle: '停车计时',
      description:
        '每次记录停车时长，用于提醒已经停了多久的车，可以控制停车费的多少。简洁的界面让计时一目了然。',
      to: '/parking',
      icon: <Car weight="fill" className="w-4 h-4" />,
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      title: '黄金价格',
      subtitle: '实时金价',
      description:
        '实时追踪黄金价格，查看近期走势，基于技术指标给出买入建议。数据来自 CoinGecko，以元/克为单位呈现。',
      to: '/gold',
      icon: <Coin weight="fill" className="w-4 h-4" />,
      gradient: 'from-amber-400 to-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] noise-overlay">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: 'transform, opacity' }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-4 mt-4">
          <div className="max-w-5xl mx-auto px-6 py-3 rounded-2xl bg-[#0a0a0b]/80 backdrop-blur-xl border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Sparkle weight="fill" className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-semibold text-white tracking-tight">AI 工具集</span>
              </Link>

              <div className="hidden sm:flex items-center gap-1">
                {[
                  { label: '倒数日', to: '/reminder' },
                  { label: '任务看板', to: '/kanban' },
                  { label: '停车计时', to: '/parking' },
                  { label: '黄金价格', to: '/gold' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Data Management Button */}
              <button
                onClick={() => setIsDataDialogOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <Database weight="bold" className="w-4 h-4" />
                <span className="hidden md:inline">数据管理</span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Asymmetric layout */}
      <section className="relative min-h-[100dvh] flex items-center pt-20">
        {/* Background decorations - subtle and refined */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left content */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="relative">
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/60 text-xs mb-8"
              >
                <Lightning weight="fill" className="w-3.5 h-3.5 text-amber-400" />
                <span>简洁、优雅、高效</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight mb-6"
              >
                <span className="text-white">AI</span>
                <br />
                <span className="text-white/40">工具集</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-white/50 max-w-md mb-10 leading-relaxed"
              >
                专为提升效率而设计的精美工具
                <br />
                <span className="text-white/30">让每一天都更有条理</span>
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3">
                <Link to="/reminder">
                  <Button
                    size="lg"
                    className="bg-white text-[#0a0a0b] hover:bg-white/90 rounded-full px-6 py-5 text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    探索工具
                  </Button>
                </Link>
                <Link to="/kanban">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-6 py-5 text-sm font-medium border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                  >
                    任务看板
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right visual - asymmetric offset */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              style={{ willChange: 'transform, opacity' }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <div className="relative w-full aspect-square max-w-md ml-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl" />
                  <div className="relative h-full rounded-3xl bg-gradient-to-br from-[#141416] to-[#0f0f10] border border-white/[0.06] p-8 overflow-hidden">
                    {/* Inner content simulation */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-24 h-3 rounded-full bg-white/10" />
                        <div className="w-8 h-8 rounded-full bg-blue-500/20" />
                      </div>
                      <div className="space-y-2">
                        <div className="w-full h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06]" />
                        <div className="w-full h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06]" />
                        <div className="w-3/4 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating card - CSS animation for better performance */}
                <div
                  className="absolute -left-8 bottom-16 w-48 animate-float"
                >
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-white/[0.08] backdrop-blur-xl p-4 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <SquaresFour weight="fill" className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">12</div>
                        <div className="text-xs text-white/40">待办任务</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Broken grid */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity' }}
            className="mb-20"
          >
            <h2 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-4">
              设计理念
            </h2>
            <p className="text-white/40 text-lg max-w-md">
              每一个功能都经过精心打磨，只为更好的体验
            </p>
          </motion.div>

          {/* Asymmetric feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {[
              {
                icon: Heart,
                title: '本地优先',
                description: '数据存储在本地，保护隐私，离线可用',
                span: 'md:col-span-5',
              },
              {
                icon: Lightning,
                title: '极速响应',
                description: '优化的性能表现，流畅的交互体验',
                span: 'md:col-span-7',
              },
              {
                icon: Shield,
                title: '隐私安全',
                description: '无需注册，数据完全由你掌控',
                span: 'md:col-span-7',
              },
              {
                icon: Sparkle,
                title: '精美设计',
                description: '每一个像素都经过深思熟虑',
                span: 'md:col-span-5',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.08
                }}
                style={{ willChange: 'transform, opacity' }}
                className={`${feature.span} group`}
              >
                <div className="h-full p-8 rounded-3xl bg-[#141416] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:shadow-2xl hover:shadow-black/30">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                    <feature.icon weight="duotone" className="w-6 h-6 text-white/60" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity' }}
            className="mb-20"
          >
            <h2 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-4">
              工具箱
            </h2>
            <p className="text-white/40 text-lg max-w-md">
              四个精心设计的效率工具，助你掌控每一天
            </p>
          </motion.div>

          <div className="space-y-8">
            {tools.map((tool, index) => (
              <ToolCard key={tool.to} {...tool} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity' }}
          >
            <h2 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight mb-6">
              开始使用
            </h2>
            <p className="text-lg text-white/40 mb-12 max-w-lg mx-auto">
              无需注册，打开即用。让 AI 工具集成为你生活和工作的好帮手。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/reminder">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-400 text-white border-0 rounded-full px-6 py-5 text-sm font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  打开倒数日
                </Button>
              </Link>
              <Link to="/kanban">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-6 py-5 text-sm font-medium border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                >
                  打开任务看板
                </Button>
              </Link>
              <Link to="/parking">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-6 py-5 text-sm font-medium border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                >
                  停车计时
                </Button>
              </Link>
              <Link to="/gold">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-6 py-5 text-sm font-medium border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                >
                  黄金价格
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Sparkle weight="fill" className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-white/80">AI 工具集</span>
            </div>
            <p className="text-sm text-white/30">
              Powered by <span className="text-white/50">zzhpro</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Data Transfer Dialog */}
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
