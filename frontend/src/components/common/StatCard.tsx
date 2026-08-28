import React, { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import { LucideIcon, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  label: string;
  value: string | number;
  numericTarget?: number;
  suffix?: string;
  subtext?: string;
  icon: LucideIcon;
  trend?: string;
  color?: 'pink' | 'purple' | 'cyan';
  id?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  numericTarget,
  suffix = '',
  subtext,
  icon: Icon,
  trend,
  color = 'pink',
  id,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (numericTarget === undefined) return;
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = numericTarget / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [numericTarget]);

  const getColorStyles = () => {
    switch (color) {
      case 'purple':
        return {
          iconBg: 'bg-purple-100/70 text-purple-600 border border-purple-200/60',
          accent: 'text-purple-600',
        };
      case 'cyan':
        return {
          iconBg: 'bg-cyan-100/70 text-cyan-600 border border-cyan-200/60',
          accent: 'text-cyan-600',
        };
      case 'pink':
      default:
        return {
          iconBg: 'bg-pink-100/80 text-pink-600 border border-pink-200/70',
          accent: 'text-[#EC4899]',
        };
    }
  };

  const colors = getColorStyles();

  return (
    <GlassCard id={id} hoverEffect className="p-6 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6470]">{label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold tracking-tight text-[#18131A]"
            >
              {numericTarget !== undefined ? `${count}${suffix}` : value}
            </motion.h3>
          </div>
          {subtext && <p className="mt-1 text-xs text-[#6B6470]">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-2xl ${colors.iconBg} shadow-sm shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-[#F3DCE8]/60 flex items-center gap-1.5 text-xs text-[#DB2777] font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{trend}</span>
        </div>
      )}
    </GlassCard>
  );
};
