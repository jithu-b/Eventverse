import React from 'react';
import { Bookmark, Users, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { EventItem } from '../../types';

interface EventCardProps {
  event: EventItem;
  onSelect: (id: string) => void;
  onRegister: (id: string) => void;
  isRegistered: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onRegister,
  isRegistered,
  isBookmarked,
  onToggleBookmark,
}) => {
  const eventDate = new Date(event.rawDate);
  const today = new Date();
  const hasEventPassed = eventDate < today;
  const spotsLeft = event.totalSpots - event.registeredCount;

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onSelect(event.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className="group cursor-pointer"
    >
      <div className="bg-[#1F1C1C] border border-[#B3282D] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden bg-white/10">
          <img
            src={event.thumbnail || event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1313]/40 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-extrabold uppercase bg-[#DC2626] text-white rounded-lg shadow-md">
              {event.category}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(event.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-[#DC2626] text-white shadow-lg'
                : 'bg-white/5 text-white hover:bg-[#141012]'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Title */}
          <h3 className="font-extrabold text-sm sm:text-base text-white line-clamp-2 group-hover:text-[#E04848] transition-colors">
            {event.title}
          </h3>

          {/* Meta Info */}
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-[#B3ABAB]">
              <Calendar className="w-3.5 h-3.5 text-[#E04848]" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-[#B3ABAB]">
              <MapPin className="w-3.5 h-3.5 text-[#E04848]" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#B3ABAB]">
                <Users className="w-3.5 h-3.5 text-[#E04848] inline mr-1" />
                {event.registeredCount} registered
              </span>
              <span className="font-bold text-[#E04848]">{spotsLeft} spots</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-[#DC2626] to-[#B91C1C] h-1.5 rounded-full transition-all"
                style={{ width: `${(event.registeredCount / event.totalSpots) * 100}%` }}
              />
            </div>
          </div>

          {/* Button */}
          <div className="pt-2">
            {hasEventPassed ? (
              <button
                disabled
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-gray-200 bg-white/5 border border-white/10 rounded-xl cursor-not-allowed"
              >
                Completed
              </button>
            ) : isRegistered ? (
              <button
                disabled
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-[#4ADE80] bg-[#1C3A2A] border border-green-500/30 rounded-xl cursor-default"
              >
                ✓ Registered
              </button>
            ) : event.registrationOpen ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(event.id);
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:shadow-lg rounded-xl transition-all cursor-pointer"
              >
                Register
              </button>
            ) : (
              <button
                disabled
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-gray-200 bg-white/5 border border-white/10 rounded-xl cursor-not-allowed"
              >
                Registrations Closed
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
