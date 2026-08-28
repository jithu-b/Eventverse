import React from 'react';
import { motion } from 'motion/react';

export interface AnimatedProgressBarProps {
  currentStep?: number;
  totalSteps?: number;
  progressPercent?: number; // 0 to 100
  label?: string;
  subtext?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pink' | 'purple' | 'cyan' | 'gradient' | 'emerald' | 'amber';
  segmented?: boolean;
  animateGlow?: boolean;
  className?: string;
  id?: string;
}

const VARIANT_GRADIENTS = {
  pink: 'from-[#EC4899] to-[#DB2777]',
  purple: 'from-[#A855F7] to-[#7E22CE]',
  cyan: 'from-[#06B6D4] to-[#0891B2]',
  gradient: 'from-[#EC4899] via-[#A855F7] to-[#22D3EE]',
  emerald: 'from-[#10B981] to-[#059669]',
  amber: 'from-[#F59E0B] to-[#D97706]',
};

const VARIANT_BG = {
  pink: 'bg-pink-100/70',
  purple: 'bg-purple-100/70',
  cyan: 'bg-cyan-100/70',
  gradient: 'bg-[#FFF1F7]',
  emerald: 'bg-emerald-100/70',
  amber: 'bg-amber-100/70',
};

const VARIANT_GLOW = {
  pink: 'shadow-[0_0_12px_rgba(236,72,153,0.5)]',
  purple: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]',
  cyan: 'shadow-[0_0_12px_rgba(6,182,212,0.5)]',
  gradient: 'shadow-[0_0_14px_rgba(236,72,153,0.4)]',
  emerald: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
  amber: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
};

const SIZES = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  currentStep,
  totalSteps,
  progressPercent,
  label,
  subtext,
  showPercent = true,
  size = 'md',
  variant = 'gradient',
  segmented = false,
  animateGlow = true,
  className = '',
  id = 'animated-progress-bar',
}) => {
  // Calculate percentage
  let percent = 0;
  if (typeof progressPercent === 'number') {
    percent = Math.min(100, Math.max(0, progressPercent));
  } else if (currentStep !== undefined && totalSteps !== undefined && totalSteps > 0) {
    percent = Math.min(100, Math.max(0, Math.round((currentStep / totalSteps) * 100)));
  }

  const heightClass = SIZES[size];
  const gradientClass = VARIANT_GRADIENTS[variant];
  const bgClass = VARIANT_BG[variant];
  const glowClass = animateGlow ? VARIANT_GLOW[variant] : '';

  return (
    <div className={`w-full space-y-1.5 ${className}`} id={id}>
      {/* Header Label and Percentage */}
      {(label || showPercent || (currentStep !== undefined && totalSteps !== undefined)) && (
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            {label && <span className="text-[#18131A] font-bold">{label}</span>}
            {currentStep !== undefined && totalSteps !== undefined && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-[#FFF1F7] text-[#DB2777] border border-[#F3DCE8]">
                Step {currentStep} of {totalSteps}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {subtext && <span className="text-[11px] text-[#6B6470]">{subtext}</span>}
            {showPercent && (
              <span className="font-mono text-xs font-bold text-[#DB2777]">
                {Math.round(percent)}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Segmented Mode vs Continuous Mode */}
      {segmented && totalSteps && totalSteps > 1 ? (
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}>
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep !== undefined && stepNum <= currentStep;
            const isCurrent = currentStep !== undefined && stepNum === currentStep;

            return (
              <div
                key={idx}
                className={`relative ${heightClass} rounded-full overflow-hidden transition-colors ${
                  isCompleted ? bgClass : 'bg-gray-100'
                }`}
              >
                {isCompleted && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.35, ease: 'easeOut', delay: idx * 0.05 }}
                    className={`h-full bg-gradient-to-r ${gradientClass} rounded-full ${
                      isCurrent && animateGlow ? glowClass : ''
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Continuous Mode */
        <div
          role="progressbar"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`relative w-full ${heightClass} ${bgClass} rounded-full overflow-hidden border border-[#F3DCE8]/50`}
        >
          {/* Animated fill track */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 70, damping: 15 }}
            className={`relative h-full bg-gradient-to-r ${gradientClass} rounded-full ${glowClass}`}
          >
            {/* Shimmer light effect overlay */}
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'linear',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent w-1/2 h-full skew-x-12"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};
