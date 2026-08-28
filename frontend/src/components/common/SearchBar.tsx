import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilterToggle?: () => void;
  filterActive?: boolean;
  className?: string;
  id?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search events, workshops, hackathons, quizzes...',
  onFilterToggle,
  filterActive = false,
  className = '',
  id,
}) => {
  return (
    <div 
      id={id}
      className={`relative flex items-center w-full bg-white/90 backdrop-blur-md border border-[#F3DCE8] focus-within:border-[#EC4899] focus-within:ring-4 focus-within:ring-pink-500/10 rounded-2xl shadow-sm transition-all duration-200 ${className}`}
    >
      <div className="pl-4 pr-2 text-[#EC4899] flex items-center pointer-events-none">
        <Search className="w-5 h-5" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3.5 pr-3 text-sm text-[#18131A] placeholder-[#6B6470]/60 bg-transparent focus:outline-none"
      />

      {value && (
        <button
          onClick={() => onChange('')}
          className="p-1.5 mr-2 text-[#6B6470] hover:text-[#EC4899] hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {onFilterToggle && (
        <button
          onClick={onFilterToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 mr-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
            filterActive
              ? 'bg-[#FFF1F7] text-[#EC4899] border-[#EC4899]'
              : 'bg-white text-[#6B6470] border-[#F3DCE8] hover:border-pink-300'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      )}
    </div>
  );
};
