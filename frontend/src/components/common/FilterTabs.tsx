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
      className={`flex items-center gap-1.5 p-1.5 bg-white/75 backdrop-blur-md border border-[#F3DCE8] rounded-2xl overflow-x-auto no-scrollbar shadow-sm ${className}`}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`relative px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-colors duration-200 whitespace-nowrap cursor-pointer z-10 select-none ${
              isActive ? 'text-white' : 'text-[#6B6470] hover:text-[#EC4899] hover:bg-pink-50/50'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 bg-gradient-to-r from-[#EC4899] to-[#A855F7] rounded-xl -z-10 shadow-sm shadow-pink-500/20"
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
