import React, { useMemo } from 'react';
import { useTheme } from './ThemeContext';

interface SparkleData {
  id: string;
  top: number; // percentage 0-100
  left: number; // percentage 0-100
  size: number; // px 10-24
  duration: number; // seconds 7-18
  delay: number; // seconds 0-10
  type: 'star4' | 'star8' | 'cross' | 'flare';
  colorIndex: number;
  animationClass: string;
  opacity: number;
}

const PINK_SHADES = [
  '#f472b6', // pink-400
  '#ec4899', // pink-500
  '#db2777', // pink-600
  '#fbcfe8', // pink-200
  '#fda4af', // rose-300
  '#fb7185', // rose-400
  '#f43f5e', // rose-500
];

const MINIMALIST_SHADES = [
  '#94a3b8', // slate-400
  '#64748b', // slate-500
  '#cbd5e1', // slate-300
  '#475569', // slate-600
  '#0f172a', // slate-900
  '#a1a1aa', // zinc-400
  '#71717a', // zinc-500
];

const ANIMATION_CLASSES = [
  'animate-sparkle-1',
  'animate-sparkle-2',
  'animate-sparkle-3',
];

interface FloatingSparklesProps {
  count?: number;
  className?: string;
}

export const FloatingSparkles: React.FC<FloatingSparklesProps> = ({
  count = 32,
  className = '',
}) => {
  const { isBlush } = useTheme();

  // Generate a stable list of randomly distributed sparkles across the page
  const sparkles = useMemo<SparkleData[]>(() => {
    // Deterministic pseudo-random seed generator so values are visually distributed nicely
    const items: SparkleData[] = [];
    const types: SparkleData['type'][] = ['star4', 'star8', 'cross', 'flare'];

    for (let i = 0; i < count; i++) {
      // Stratified positioning for balanced distribution across viewports
      const gridRow = Math.floor(i / 4);
      const totalRows = Math.ceil(count / 4);
      const rowMin = (gridRow / totalRows) * 94;
      const rowMax = ((gridRow + 1) / totalRows) * 94;

      const randomTop = rowMin + Math.random() * (rowMax - rowMin);
      const randomLeft = Math.random() * 95;

      const size = 11 + Math.floor(Math.random() * 14); // 11px to 24px
      const duration = 8 + Math.random() * 12; // 8s to 20s
      const delay = Math.random() * 10;
      const type = types[i % types.length];
      const colorIndex = Math.floor(Math.random() * PINK_SHADES.length);
      const animationClass = ANIMATION_CLASSES[i % ANIMATION_CLASSES.length];
      const opacity = 0.65 + Math.random() * 0.35;

      items.push({
        id: `sparkle-${i}-${Math.floor(randomTop)}-${Math.floor(randomLeft)}`,
        top: randomTop,
        left: randomLeft,
        size,
        duration,
        delay,
        type,
        colorIndex,
        animationClass,
        opacity,
      });
    }

    return items;
  }, [count]);

  const activeColors = isBlush ? PINK_SHADES : MINIMALIST_SHADES;

  return (
    <div
      id="floating-sparkles-container"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {sparkles.map((sparkle) => {
        const color = activeColors[sparkle.colorIndex % activeColors.length];
        return (
          <div
            key={sparkle.id}
            id={sparkle.id}
            className={`absolute ${sparkle.animationClass}`}
            style={{
              top: `${sparkle.top}%`,
              left: `${sparkle.left}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              animationDuration: `${sparkle.duration}s`,
              animationDelay: `${sparkle.delay}s`,
              opacity: isBlush ? sparkle.opacity : sparkle.opacity * 0.85,
            }}
          >
            <SparkleSVG
              type={sparkle.type}
              color={color}
              size={sparkle.size}
              isBlush={isBlush}
            />
          </div>
        );
      })}
    </div>
  );
};

interface SparkleSVGProps {
  type: SparkleData['type'];
  color: string;
  size: number;
  isBlush: boolean;
}

const SparkleSVG: React.FC<SparkleSVGProps> = ({ type, color, size, isBlush }) => {
  const dropShadowFilter = isBlush
    ? 'drop-shadow-[0_0_4px_rgba(244,114,182,0.6)]'
    : 'drop-shadow-[0_0_4px_rgba(148,163,184,0.45)]';

  switch (type) {
    case 'star4':
      // 4-Point Diamond Sparkle
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full filter ${dropShadowFilter}`}
        >
          <path
            d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"
            fill={color}
          />
        </svg>
      );

    case 'star8':
      // 8-Point Radiant Star Sparkle
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full filter ${dropShadowFilter}`}
        >
          <path
            d="M12 1C12 6.5 7.5 11 2 11C7.5 11 12 15.5 12 21C12 15.5 16.5 11 22 11C16.5 11 12 6.5 12 1Z"
            fill={color}
          />
          <path
            d="M12 5.5C12 9 9.5 11.5 6 11.5C9.5 11.5 12 14 12 17.5C12 14 14.5 11.5 18 11.5C14.5 11.5 12 9 12 5.5Z"
            fill={color}
            transform="rotate(45 12 11.5)"
            opacity="0.75"
          />
        </svg>
      );

    case 'cross':
      // Elegant Cross Sparkle
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full filter ${dropShadowFilter}`}
        >
          <path
            d="M12 2V22M2 12H22"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3.5" fill={color} />
        </svg>
      );

    case 'flare':
    default:
      // Diamond Flare with Center Light Spark
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full filter ${dropShadowFilter}`}
        >
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill={color}
          />
          <circle cx="12" cy="12" r="2" fill="#ffffff" opacity="0.9" />
        </svg>
      );
  }
};

