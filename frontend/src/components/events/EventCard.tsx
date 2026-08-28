import React from 'react';
import { Calendar, Clock, MapPin, Users, Bookmark, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { EventItem } from '../../types';
import { GradientButton } from '../common/GradientButton';

interface EventCardProps {
  event: EventItem;
  onSelect: (eventId: string) => void;
  onRegister?: (eventId: string) => void;
  isRegistered?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (eventId: string) => void;
  layout?: 'grid' | 'list';
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onRegister,
  isRegistered = false,
  isBookmarked = false,
  onToggleBookmark,
  layout = 'grid',
}) => {
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.totalSpots) * 100));

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Workshops':
        return 'bg-pink-100/90 text-pink-700 border-pink-200';
      case 'Hackathons':
        return 'bg-purple-100/90 text-purple-700 border-purple-200';
      case 'Competitions':
        return 'bg-cyan-100/90 text-cyan-800 border-cyan-200';
      case 'Tech Talks':
        return 'bg-rose-100/90 text-rose-700 border-rose-200';
      case 'Social':
      default:
        return 'bg-emerald-100/90 text-emerald-800 border-emerald-200';
    }
  };

  if (layout === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25 }}
        className="group relative bg-white/90 backdrop-blur-md rounded-2xl border border-[#F3DCE8] hover:border-pink-300 hover:shadow-xl hover:shadow-pink-500/10 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition-all"
        id={`event-card-list-${event.id}`}
      >
        <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-pink-50">
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              loading="lazy"
            />
            {event.featured && (
              <span className="absolute top-1.5 left-1.5 p-1 rounded-lg bg-pink-600/90 backdrop-blur-sm text-white shadow-xs" title="Featured">
                <Sparkles className="w-3 h-3" />
              </span>
            )}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full border ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
              {isRegistered && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-full border border-green-200">
                  <CheckCircle2 className="w-3 h-3" /> Registered
                </span>
              )}
            </div>

            <h3 
              onClick={() => onSelect(event.id)}
              className="text-base sm:text-lg font-bold text-[#18131A] hover:text-[#EC4899] transition-colors cursor-pointer truncate"
            >
              {event.title}
            </h3>

            <p className="text-xs text-[#6B6470] line-clamp-1">{event.subtitle}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B6470] pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#EC4899]" />
                {event.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#A855F7]" />
                {event.time.split('·')[0]}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />
                {event.location.split('·')[0]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3DCE8]">
          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-[#18131A] block">{event.registeredCount} / {event.totalSpots}</span>
            <span className="text-[10px] text-[#6B6470]">Spots filled</span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleBookmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(event.id);
                }}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#FFF1F7] text-[#EC4899] border-[#EC4899]'
                    : 'bg-white text-[#6B6470] border-[#F3DCE8] hover:text-[#EC4899]'
                }`}
                aria-label="Bookmark event"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#EC4899]' : ''}`} />
              </button>
            )}

            <GradientButton
              size="sm"
              onClick={() => onSelect(event.id)}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {isRegistered ? 'View Pass' : 'Details'}
            </GradientButton>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white/95 backdrop-blur-xl rounded-3xl border border-[#F3DCE8] hover:border-pink-300 hover:shadow-2xl hover:shadow-pink-500/12 overflow-hidden flex flex-col h-full transition-all duration-300"
      id={`event-card-${event.id}`}
    >
      {/* Event Banner Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-pink-100/50">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          loading="lazy"
        />

        {/* Gradient Overlay for badge contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className={`px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-xs backdrop-blur-md border ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
            {event.featured && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-pink-600/90 backdrop-blur-md text-white rounded-full shadow-xs">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          <div className="pointer-events-auto">
            {onToggleBookmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(event.id);
                }}
                className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                  isBookmarked
                    ? 'bg-white text-[#EC4899]'
                    : 'bg-white/80 text-[#18131A] hover:bg-white hover:text-[#EC4899]'
                }`}
                aria-label="Bookmark event"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#EC4899]' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Registered status indicator pill */}
        {isRegistered && (
          <div className="absolute bottom-3 left-3.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-green-500/90 backdrop-blur-md text-white rounded-full shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Registered
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 
            onClick={() => onSelect(event.id)}
            className="text-lg font-extrabold text-[#18131A] group-hover:text-[#EC4899] transition-colors cursor-pointer line-clamp-1 tracking-tight"
          >
            {event.title}
          </h3>

          <p className="text-xs text-[#6B6470] leading-relaxed line-clamp-2">
            {event.description}
          </p>

          {/* Metadata chips */}
          <div className="pt-2 space-y-2 text-xs text-[#6B6470]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#EC4899] shrink-0" />
              <span className="font-semibold text-[#18131A]">{event.date}</span>
              <span className="text-[#6B6470]/60">·</span>
              <Clock className="w-4 h-4 text-[#A855F7] shrink-0" />
              <span>{event.time}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#22D3EE] shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Spots progress bar & CTA */}
        <div className="pt-3 border-t border-[#F3DCE8]/80 space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-[#6B6470]">
                <Users className="w-3.5 h-3.5 text-[#EC4899]" />
                <span>{event.registeredCount} participants</span>
              </span>
              <span className="font-bold text-[#18131A]">
                {event.totalSpots - event.registeredCount > 0
                  ? `${event.totalSpots - event.registeredCount} spots left`
                  : 'Housefull'}
              </span>
            </div>

            {/* Custom styled progress line */}
            <div className="w-full h-1.5 bg-pink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#EC4899] to-[#A855F7] rounded-full transition-all duration-500"
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onSelect(event.id)}
              className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl border border-[#F3DCE8] text-[#18131A] hover:text-[#EC4899] hover:bg-pink-50/70 transition-colors text-center cursor-pointer"
            >
              View Info
            </button>

            {event.status === 'Completed' ? (
              <button
                disabled
                className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed text-center"
              >
                Completed
              </button>
            ) : (
              <GradientButton
                size="sm"
                onClick={() => (onRegister ? onRegister(event.id) : onSelect(event.id))}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                className="flex-1"
              >
                {isRegistered ? 'My Pass →' : 'Register →'}
              </GradientButton>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
