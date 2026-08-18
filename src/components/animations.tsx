'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

// Shared animation variants — subtle, fast, professional.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Default transition — 400ms with a gentle ease.
const defaultTransition = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const };

// Animates children on initial page load (no scroll trigger).
// Used for hero sections where content is already in the viewport.
export function FadeIn({
  children,
  delay = 0,
  className = '',
  y = 20,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// Animates a section when it enters the viewport (scroll-triggered).
// Used for content below the fold — services grids, CTA bands, etc.
export function FadeInOnScroll({
  children,
  className = '',
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: { opacity: 0, y }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// Staggered container — animates direct children with a small delay between
// each. Use for grids/lists where items should appear one after another.
export function StaggerGroup({
  children,
  className = '',
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

// Individual item inside a StaggerGroup.
export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={defaultTransition}
    >
      {children}
    </motion.div>
  );
}

export { fadeUp, fadeIn, defaultTransition };
