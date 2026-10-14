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
        return 'bg-[#1F1C1C] border border-[#B3282D] shadow-sm';
      case 'solid':
        return 'bg-[#1F1C1C] border border-[#B3282D] shadow-md shadow-red-600/5';
      case 'medium':
      default:
        return 'bg-[#1F1C1C] border border-[#B3282D] shadow-md shadow-red-600/5';
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
