// src/routes/vocab/VocabPage.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowLeft, GraduationCap } from '@phosphor-icons/react';
import VocabSearchBar from '@/modules/vocab/components/VocabSearchBar';
import VocabList from '@/modules/vocab/components/VocabList';
import { useVocabStore } from '@/modules/vocab/stores/vocabStore';
import { slideDown, fadeInUp } from '@/shared/lib/motion';

export default function VocabPage() {
  const {
    filteredWords,
    searchQuery,
    selectedLevel,
    selectedCategory,
    isLoading,
    initialized,
    initVocabulary,
    setSearchQuery,
    setSelectedLevel,
    setSelectedCategory,
    playPronunciation,
  } = useVocabStore();

  useEffect(() => {
    initVocabulary();
  }, [initVocabulary]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] noise-overlay">
      {/* Navigation */}
      <motion.nav
        {...slideDown}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-4 mt-4">
          <div className="max-w-5xl mx-auto px-6 py-3 rounded-2xl bg-[#0a0a0b]/80 backdrop-blur-xl border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft weight="bold" className="w-4 h-4" />
                <span className="text-sm">返回</span>
              </Link>

              <div className="flex items-center gap-2">
                <GraduationCap weight="fill" className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-white">英语词汇</span>
              </div>

              <div className="w-16" />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div {...fadeInUp} className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-2">
              幼儿英语词汇
            </h1>
            <p className="text-white/40 text-base lg:text-lg">
              从幼儿园到小学，轻松掌握常见英语单词
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div {...fadeInUp} className="mb-8">
            <VocabSearchBar
              searchQuery={searchQuery}
              selectedLevel={selectedLevel}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchQuery}
              onLevelChange={setSelectedLevel}
              onCategoryChange={setSelectedCategory}
            />
          </motion.div>

          {/* Word List */}
          <motion.div {...fadeInUp}>
            <VocabList
              words={filteredWords}
              isLoading={isLoading || !initialized}
              onPlay={playPronunciation}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
