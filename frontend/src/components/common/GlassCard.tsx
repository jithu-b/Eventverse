import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  intensity?: 'light' | 'medium' | 'solid';
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  intensity = 'medium',
  id,
  ...props
}) => {
  const getIntensityClass = () => {
    switch (intensity) {
      case 'light':
        return 'bg-white/60 backdrop-blur-md border border-[#F3DCE8]/60 shadow-sm';
      case 'solid':
        return 'bg-white/95 backdrop-blur-xl border border-[#F3DCE8] shadow-md shadow-pink-500/5';
      case 'medium':
      default:
        return 'bg-white/80 backdrop-blur-lg border border-[#F3DCE8] shadow-md shadow-pink-500/5';
    }
  };

  return (
    <div
      id={id}
      className={`rounded-2xl ${getIntensityClass()} ${hoverEffect ? 'glass-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
