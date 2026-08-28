import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  LayoutGrid, 
  List, 
  SlidersHorizontal, 
  Sparkles, 
  Calendar, 
  Search, 
  X, 
  RotateCcw 
} from 'lucide-react';
import { motion } from 'motion/react';
import { EventItem, EventCategory } from '../types';
import { SearchBar } from '../components/common/SearchBar';
import { FilterTabs } from '../components/common/FilterTabs';
import { EventCard } from '../components/events/EventCard';
import { GradientButton } from '../components/common/GradientButton';

interface EventDiscoveryPageProps {
  events: EventItem[];
  onSelectEvent: (eventId: string) => void;
  onRegisterEvent: (eventId: string) => void;
  registeredEventIds: string[];
  bookmarkedEventIds: string[];
  onToggleBookmark: (eventId: string) => void;
  onCreateEvent: () => void;
}

const CATEGORIES: EventCategory[] = [
  'All',
  'Workshops',
  'Hackathons',
  'Competitions',
  'Tech Talks',
  'Social',
];

export const EventDiscoveryPage: React.FC<EventDiscoveryPageProps> = ({
  events = [],
  onSelectEvent,
  onRegisterEvent,
  registeredEventIds = [],
  bookmarkedEventIds = [],
  onToggleBookmark,
  onCreateEvent,
}) => {
  const safeEvents = Array.isArray(events) ? events : [];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Upcoming' | 'Completed'>('All');
  const [sortBy, setSortBy] = useState<'Newest' | 'Popular' | 'Upcoming'>('Upcoming');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    safeEvents.forEach((e) => (e?.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 10);
  }, [safeEvents]);

  // Filtering & Sorting
  const filteredEvents = useMemo(() => {
    return safeEvents
      .filter((e) => {
        if (!e) return false;
        // Category filter
        if (activeCategory !== 'All' && e.category !== activeCategory) {
          return false;
        }
        // Status filter
        if (statusFilter !== 'All' && e.status !== statusFilter) {
          return false;
        }
        // Tag filter
        if (selectedTag && !(e.tags || []).includes(selectedTag)) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (e.title || '').toLowerCase().includes(q);
          const matchSub = (e.subtitle || '').toLowerCase().includes(q);
          const matchDesc = (e.description || '').toLowerCase().includes(q);
          const matchLoc = (e.location || '').toLowerCase().includes(q);
          const matchTags = (e.tags || []).some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchSub || matchDesc || matchLoc || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Popular') {
          return (b?.registeredCount || 0) - (a?.registeredCount || 0);
        }
        if (sortBy === 'Newest') {
          return new Date(b?.rawDate || '').getTime() - new Date(a?.rawDate || '').getTime();
        }
        // Default Upcoming
        return new Date(a?.rawDate || '').getTime() - new Date(b?.rawDate || '').getTime();
      });
  }, [safeEvents, activeCategory, statusFilter, selectedTag, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setStatusFilter('All');
    setSelectedTag(null);
    setSortBy('Upcoming');
  };

  const hasActiveFilters = searchQuery || activeCategory !== 'All' || statusFilter !== 'All' || selectedTag !== null;

  return (
    <div className="space-y-10" id="event-discovery-container">
      {/* 1. Header Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-[#FFF1F7] text-[#DB2777] rounded-full border border-[#F3DCE8]"
        >
          <Compass className="w-3.5 h-3.5 text-[#EC4899]" />
          <span>CAMPUS EVENTS CATALOG</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#18131A] font-outfit"
        >
          Discover Events
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm sm:text-base text-[#6B6470]"
        >
          Find your next challenge, workshop, competition, or community event.
        </motion.p>
      </div>

      {/* 2. Search & Controls Bar */}
      <div className="space-y-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Bar */}
          <div className="w-full md:max-w-xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by topic, speaker, hackathon name, or keywords..."
              id="events-search-input"
            />
          </div>

          {/* Sort & Layout Controls */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6B6470]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs font-bold text-[#18131A] bg-white border border-[#F3DCE8] rounded-xl focus:outline-none focus:border-[#EC4899] cursor-pointer shadow-xs"
                id="sort-select-dropdown"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Popular">Most Popular</option>
                <option value="Newest">Recently Added</option>
              </select>
            </div>

            {/* Layout Toggle (Grid / List) */}
            <div className="flex items-center p-1 bg-white border border-[#F3DCE8] rounded-xl shadow-xs">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layoutMode === 'grid' ? 'bg-[#FFF1F7] text-[#DB2777]' : 'text-[#6B6470] hover:text-[#18131A]'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layoutMode === 'list' ? 'bg-[#FFF1F7] text-[#DB2777]' : 'text-[#6B6470] hover:text-[#18131A]'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <FilterTabs
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            id="category-filter-tabs"
          />

          {/* Status Chips */}
          <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto overflow-x-auto no-scrollbar">
            {(['All', 'Upcoming', 'Completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#18131A] text-white border-[#18131A]'
                    : 'bg-white text-[#6B6470] border-[#F3DCE8] hover:border-pink-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-bold text-[#6B6470] shrink-0">Popular tags:</span>
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#DB2777] text-white font-bold shadow-xs'
                    : 'bg-white/80 hover:bg-[#FFF1F7] text-[#6B6470] border border-[#F3DCE8]'
                }`}
              >
                #{tag}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1 text-[11px] font-bold text-[#EC4899] hover:underline flex items-center gap-1 shrink-0 cursor-pointer ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Results Count Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#6B6470] px-1">
        <span>
          Showing <strong className="text-[#18131A]">{filteredEvents.length}</strong> {filteredEvents.length === 1 ? 'event' : 'events'}
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
        </span>
      </div>

      {/* 4. Events Grid / List */}
      <div className="max-w-7xl mx-auto">
        {filteredEvents.length > 0 ? (
          <div className={layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8' : 'space-y-4'}>
            {filteredEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                layout={layoutMode}
                onSelect={onSelectEvent}
                onRegister={onRegisterEvent}
                isRegistered={registeredEventIds.includes(evt.id)}
                isBookmarked={bookmarkedEventIds.includes(evt.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white/80 backdrop-blur-md rounded-3xl border border-[#F3DCE8] space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF1F7] text-[#EC4899] flex items-center justify-center mx-auto shadow-xs">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#18131A]">No events match your criteria</h3>
            <p className="text-xs text-[#6B6470] leading-relaxed">
              We couldn't find any events matching your current search filters. Try clearing your filters or exploring another category.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 text-xs font-bold text-[#DB2777] bg-[#FFF1F7] hover:bg-pink-100 border border-[#F3DCE8] rounded-xl transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
