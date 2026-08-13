import { motion } from "framer-motion";

/**
 * Scroll-triggered reveal wrapper — fade + slide, used throughout for
 * consistent, restrained scroll animation instead of scattered one-offs.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.8,
  className = "",
  as = "div",
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}
