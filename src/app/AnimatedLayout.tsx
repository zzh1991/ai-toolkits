// src/app/AnimatedLayout.tsx
import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useMotionTransition, motionTransitions } from '@/shared/lib/motion';

export default function AnimatedLayout() {
  const location = useLocation();
  const transition = useMotionTransition(motionTransitions.quick);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
