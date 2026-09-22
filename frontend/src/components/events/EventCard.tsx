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
      <div className="bg-white/90 backdrop-blur-md border border-[#F3DCE8] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-200">
          <img
            src={event.thumbnail || event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18131A]/40 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-extrabold uppercase bg-[#EC4899] text-white rounded-lg shadow-md">
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
                ? 'bg-[#EC4899] text-white shadow-lg'
                : 'bg-white/80 text-[#18131A] hover:bg-white'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Title */}
          <h3 className="font-extrabold text-sm sm:text-base text-[#18131A] line-clamp-2 group-hover:text-[#EC4899] transition-colors">
            {event.title}
          </h3>

          {/* Meta Info */}
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-[#6B6470]">
              <Calendar className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-[#6B6470]">
              <MapPin className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B6470]">
                <Users className="w-3.5 h-3.5 text-[#EC4899] inline mr-1" />
                {event.registeredCount} registered
              </span>
              <span className="font-bold text-[#DB2777]">{spotsLeft} spots</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-[#EC4899] to-[#A855F7] h-1.5 rounded-full transition-all"
                style={{ width: `${(event.registeredCount / event.totalSpots) * 100}%` }}
              />
            </div>
          </div>

          {/* Button */}
          <div className="pt-2">
            {hasEventPassed ? (
              <button
                disabled
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 border border-gray-300 rounded-xl cursor-not-allowed"
              >
                Completed
              </button>
            ) : isRegistered ? (
              <button
                disabled
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-green-700 bg-green-50 border border-green-300 rounded-xl cursor-default"
              >
                ✓ Registered
              </button>
            ) : event.registrationOpen ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(event.id);
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#EC4899] to-[#A855F7] hover:shadow-lg rounded-xl transition-all cursor-pointer"
              >
                Register
              </button>
            ) : (
              <button
                disabled
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 border border-gray-300 rounded-xl cursor-not-allowed"
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
