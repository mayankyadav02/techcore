"use client";

import { motion, useReducedMotion } from "framer-motion";

export function FadeIn({
  children,
  className,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const hidden = reduce ? false : { opacity: 0, y: 8 };
  const shown = { opacity: 1, y: 0 };
  const transition = { duration: reduce ? 0 : 0.28, ease: "easeOut" as const };

  if (immediate) {
    return (
      <motion.div
        className={className}
        initial={hidden}
        animate={shown}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, amount: 0.16 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
