import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GradientButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  id?: string;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className = '',
  id,
  ...props
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3.5 py-1.5 text-xs font-semibold rounded-xl gap-1.5';
      case 'lg':
        return 'px-7 py-3.5 text-base font-bold rounded-2xl gap-2.5 shadow-pink-soft';
      case 'md':
      default:
        return 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2 shadow-sm';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#DC2626] via-[#E11D27] to-[#B91C1C] text-white hover:opacity-95 hover:shadow-lg hover:shadow-red-600/25 active:scale-[0.98] border border-red-400/30';
      case 'secondary':
        return 'bg-[#141012] text-[#E04848] hover:bg-[#141012] border border-[#B3282D] active:scale-[0.98]';
      case 'outline':
        return 'bg-white/5 backdrop-blur-sm text-white hover:text-[#E04848] border border-[#B3282D] hover:border-[#DC2626] hover:bg-red-500/15 active:scale-[0.98]';
      case 'ghost':
        return 'bg-transparent text-[#B3ABAB] hover:text-[#E04848] hover:bg-red-500/15 active:scale-[0.98]';
    }
  };

  return (
    <motion.button
      id={id}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${getSizeStyles()} ${getVariantStyles()} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </motion.button>
  );
};
