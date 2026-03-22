// src/routes/landing/LandingPage.tsx
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Heart } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import ReminderIllustration from './components/ReminderIllustration';
import KanbanIllustration from './components/KanbanIllustration';
import ParkingIllustration from './components/ParkingIllustration';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

interface ToolCardProps {
  title: string;
  subtitle: string;
  description: string;
  to: string;
  illustration: React.ReactNode;
  gradient: string;
  reversed?: boolean;
}

function ToolCard({ title, subtitle, description, to, illustration, gradient, reversed }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-2xl shadow-black/5 ${
        reversed ? 'lg:flex-row-reverse' : ''
      }`}
    >
      <div className="flex flex-col lg:flex-row items-center">
        {/* Content Side */}
        <div className="flex-1 p-8 lg:p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${gradient} text-white mb-4`}>
              {subtitle}
            </span>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-lg">
              {description}
            </p>
            <Link to={to}>
              <Button
                size="lg"
                className={`bg-gradient-to-r ${gradient} text-white border-0 rounded-full px-8 py-6 text-base font-medium group`}
              >
                开始使用
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Illustration Side */}
        <div className="flex-1 w-full p-6 lg:p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[400px] xl:h-[450px]"
          >
            {illustration}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">AI 工具集</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/reminder" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                倒数日
              </Link>
              <Link to="/kanban" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                任务看板
              </Link>
              <Link to="/parking" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                停车倒计时
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-purple-100/50 to-transparent dark:from-purple-900/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-[600px] h-[400px] bg-gradient-to-b from-blue-100/30 to-transparent dark:from-blue-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm mb-8"
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>简洁、优雅、高效</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                AI 工具集
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              专为提升效率而设计的精美工具
              <br />
              <span className="text-gray-400">让每一天都更有条理</span>
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/reminder">
                <Button
                  size="lg"
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-full px-8 py-6 text-base font-medium"
                >
                  探索工具
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-32 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              核心功能
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              精心打造，只为更好的体验
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: '本地优先',
                description: '数据存储在本地，保护隐私，离线可用',
                color: 'text-pink-500',
                bg: 'bg-pink-50 dark:bg-pink-950/30',
              },
              {
                icon: Zap,
                title: '极速响应',
                description: '优化的性能表现，流畅的交互体验',
                color: 'text-yellow-500',
                bg: 'bg-yellow-50 dark:bg-yellow-950/30',
              },
              {
                icon: Shield,
                title: '隐私安全',
                description: '无需注册，数据完全由你掌控',
                color: 'text-blue-500',
                bg: 'bg-blue-50 dark:bg-blue-950/30',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${feature.bg} flex items-center justify-center`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-24">
          {/* Reminder Tool */}
          <ToolCard
            title="倒数日"
            subtitle="纪念日管理"
            description="记录生命中每一个重要的日子。生日、纪念日、考试倒计时...用优雅的方式追踪时间的流逝，让每一个特殊时刻都不会被遗忘。"
            to="/reminder"
            illustration={<ReminderIllustration />}
            gradient="from-violet-500 to-fuchsia-500"
          />

          {/* Kanban Tool */}
          <ToolCard
            title="四象限任务看板"
            subtitle="任务管理"
            description="基于艾森豪威尔矩阵的任务管理工具。区分重要与紧急，合理安排时间，提升工作效率，让每一天都过得充实而有意义。"
            to="/kanban"
            illustration={<KanbanIllustration />}
            gradient="from-blue-500 to-cyan-500"
            reversed
          />

          {/* Parking Tool */}
          <ToolCard
            title="停车倒计时"
            subtitle="停车计时"
            description="每次记录停车时长，用于提醒已经停了多久的车，可以控制停车费的多少。简洁的界面让计时一目了然。"
            to="/parking"
            illustration={<ParkingIllustration />}
            gradient="from-emerald-500 to-teal-500"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              开始使用
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto">
              无需注册，打开即用。让 AI 工具集成为你生活和工作的好帮手。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/reminder">
                <Button
                  size="lg"
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-full px-8 py-6 text-base font-medium"
                >
                  打开倒数日
                </Button>
              </Link>
              <Link to="/kanban">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-base font-medium border-gray-300 dark:border-gray-700"
                >
                  打开任务看板
                </Button>
              </Link>
              <Link to="/parking">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-base font-medium border-gray-300 dark:border-gray-700"
                >
                  打开停车倒计时
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900 dark:text-white">AI 工具集</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered By <span className="font-medium">zzhpro</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
