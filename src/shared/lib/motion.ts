// src/shared/lib/motion.ts
import { useState, useEffect } from 'react';

/**
 * Hook to detect prefers-reduced-motion media query.
 * Returns true when the user has requested reduced motion.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/**
 * Wraps a Framer Motion transition config with reduced-motion awareness.
 * When prefers-reduced-motion is enabled, durations collapse to near-zero.
 *
 * Usage:
 *   const transition = useMotionTransition({ duration: 0.25, ease: [0.22, 1, 0.36, 1] });
 *   <motion.div transition={transition} />
 */
export function useMotionTransition<T extends Record<string, unknown>>(
  base: T
): T {
  const reduced = useReducedMotion();
  if (!reduced) return base;
  return {
    ...base,
    duration: 0.001,
    delay: 0,
    ease: 'linear' as unknown as T extends { ease: infer E } ? E : never,
  } as T;
}

/**
 * Centralized Framer Motion transition presets.
 *
 * These mirror the CSS tokens in src/index.css (--ease-smooth-out, --duration-fast, etc.)
 * but as JS values since Framer Motion cannot read CSS custom properties for ease arrays.
 */
export const motionTransitions = {
  /** Standard entrance: fade + slide up. 250ms. */
  entrance: {
    duration: 0.25,
    ease: [0.22, 1, 0.36, 1] as const,
  },

  /** Quick entrance for high-frequency elements. 150ms. */
  quick: {
    duration: 0.15,
    ease: [0.22, 1, 0.36, 1] as const,
  },

  /** Medium entrance for larger containers. 350ms. */
  medium: {
    duration: 0.35,
    ease: [0.22, 1, 0.36, 1] as const,
  },

  /** Exit: faster than entrance. 150ms. */
  exit: {
    duration: 0.15,
    ease: [0.22, 1, 0.36, 1] as const,
  },

  /** Bounce for playful moments. 500ms. */
  bounce: {
    duration: 0.5,
    ease: [0.34, 1.36, 0.64, 1] as const,
  },

  /** Strong bounce for delight moments. 600ms. */
  bounceStrong: {
    duration: 0.6,
    ease: [0.34, 3.85, 0.64, 1] as const,
  },
} as const;

/**
 * Pre-built motion variant objects for common patterns.
 *
 * Usage:
 *   import { fadeInUp } from '@/shared/lib/motion';
 *   <motion.div {...fadeInUp} />
 *
 * For reduced-motion support, combine with useMotionTransition:
 *   const t = useMotionTransition(motionTransitions.entrance);
 *   <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={t} />
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: motionTransitions.entrance,
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: motionTransitions.entrance,
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  transition: motionTransitions.entrance,
};

export const slideUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: motionTransitions.quick,
};

export const slideDown = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: motionTransitions.quick,
};
