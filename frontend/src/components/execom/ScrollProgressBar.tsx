import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useTheme } from './ThemeContext';

interface ScrollProgressBarProps {
  targetId?: string;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  targetId,
}) => {
  const { isBlush } = useTheme();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (el) {
      setTargetElement(el);
    }
  }, [targetId]);

  // Track scroll progress through the Exicom section if available, otherwise entire document
  const { scrollYProgress } = useScroll(
    targetElement
      ? {
          target: { current: targetElement },
          offset: ['start 85%', 'end 25%'],
        }
      : undefined
  );

  // Smooth out progress updates with spring physics
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  });

  // Track percentage for tooltip / subtle glow head
  const opacity = useTransform(scaleX, [0, 0.03, 0.98, 1], [0, 1, 1, 0.8]);

  return (
    <div
      id="exicom-scroll-progress-bar-container"
      className={`fixed top-0 left-0 right-0 z-50 pointer-events-none h-[3px] sm:h-[3.5px] ${
        isBlush ? 'bg-pink-100/40' : 'bg-slate-200/50'
      } backdrop-blur-xs transition-colors duration-300`}
      aria-hidden="true"
    >
      {/* Animated Gradient Progress Track */}
      <motion.div
        id="exicom-scroll-progress-bar"
        className={`h-full origin-left ${
          isBlush
            ? 'bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600 shadow-[0_0_10px_rgba(244,114,182,0.85)]'
            : 'bg-gradient-to-r from-slate-400 via-slate-700 to-slate-900 shadow-[0_0_10px_rgba(15,23,42,0.35)]'
        }`}
        style={{
          scaleX,
          opacity,
          willChange: 'transform',
        }}
      />

      {/* Leading Radiant Spark Head */}
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white ring-2 ${
          isBlush ? 'ring-pink-400 shadow-[0_0_8px_#ec4899]' : 'ring-slate-700 shadow-[0_0_8px_rgba(15,23,42,0.6)]'
        }`}
        style={{
          left: useTransform(scaleX, (v) => `${Math.max(0, Math.min(100, v * 100))}%`),
          opacity,
          willChange: 'left, opacity',
        }}
      />
    </div>
  );
};

