import React from 'react';
import { motion } from 'motion/react';
import { EventCategory } from '../../types';

interface FilterTabsProps {
  categories: (EventCategory | string)[];
  activeCategory: string;
  onSelectCategory: (category: any) => void;
  className?: string;
  id?: string;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`flex items-center gap-1.5 p-1.5 bg-[#1F1C1C] border border-[#B3282D] rounded-2xl overflow-x-auto no-scrollbar shadow-sm ${className}`}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`relative px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-colors duration-200 whitespace-nowrap cursor-pointer z-10 select-none ${
              isActive ? 'text-white' : 'text-[#B3ABAB] hover:text-[#E04848] hover:bg-red-500/15'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] rounded-xl -z-10 shadow-sm shadow-red-600/20"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            {cat}
          </button>
        );
      })}
    </div>
  );
};
