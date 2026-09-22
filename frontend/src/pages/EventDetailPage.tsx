import React from 'react';
import { Trash2, Edit2, MapPin, Clock, Users, Share2, Bookmark, MessageCircle, QrCode, CheckCircle2, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { EventItem } from '../types';
import { GradientButton } from '../components/common/GradientButton';
import { GlassCard } from '../components/common/GlassCard';

interface EventDetailPageProps {
  event: EventItem;
  onBack: () => void;
  onRegister: (eventId: string) => void;
  isRegistered: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (eventId: string) => void;
  onOpenQRScanner: () => void;
  onDelete?: () => void;
  onEdit?: (event: EventItem) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event, onBack, onRegister, isRegistered, isBookmarked, onToggleBookmark, onOpenQRScanner, onDelete, onEdit
}) => {
  const bookmarkClasses = isBookmarked ? 'bg-[#EC4899] text-white shadow-lg' : 'bg-white/80 text-[#18131A] hover:bg-white';
  const capacityPercent = (event.registeredCount / event.totalSpots) * 100;
  const eventDate = new Date(event.rawDate);
  const today = new Date();
  const hasEventPassed = eventDate < today;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={onBack} className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#DB2777] hover:text-[#EC4899] transition-colors cursor-pointer">
        ← Back to Events
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-64 sm:h-96 rounded-3xl overflow-hidden shadow-xl">
        <img src={event.bannerImage || event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18131A] via-transparent to-transparent" />
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2">
          <span className="px-3 py-1.5 text-xs sm:text-sm font-extrabold uppercase bg-[#EC4899] text-white rounded-full shadow-lg">{event.category}</span>
        </div>
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-2">
          <button onClick={() => onToggleBookmark(event.id)} className={`p-2.5 sm:p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${bookmarkClasses}`}>
            <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button onClick={() => navigator.share?.({ title: event.title, url: window.location.href })} className="p-2.5 sm:p-3 rounded-full bg-white/80 text-[#18131A] hover:bg-white backdrop-blur-md transition-all cursor-pointer">
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18131A] font-outfit tracking-tight">{event.title}</h1>
            {event.subtitle && <p className="text-base sm:text-lg text-[#6B6470]">{event.subtitle}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3 sm:gap-4">
            <GlassCard className="p-3 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B6470] mb-1"><Clock className="w-4 h-4 text-[#EC4899]" /><span>Date & Time</span></div>
              <p className="text-sm sm:text-base font-bold text-[#18131A]">{event.date}</p>
              <p className="text-xs sm:text-sm text-[#6B6470]">{event.time}</p>
            </GlassCard>
            <GlassCard className="p-3 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B6470] mb-1"><MapPin className="w-4 h-4 text-[#EC4899]" /><span>Location</span></div>
              <p className="text-sm sm:text-base font-bold text-[#18131A]">{event.location}</p>
            </GlassCard>
            <GlassCard className="p-3 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B6470] mb-1"><Users className="w-4 h-4 text-[#EC4899]" /><span>Capacity</span></div>
              <p className="text-sm sm:text-base font-bold text-[#18131A]">{event.registeredCount}/{event.totalSpots}</p>
              <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5"><div className="bg-gradient-to-r from-[#EC4899] to-[#A855F7] h-1.5 rounded-full" style={{ width: `${capacityPercent}%` }} /></div>
            </GlassCard>
            <GlassCard className="p-3 sm:p-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B6470] mb-1"><Trophy className="w-4 h-4 text-[#EC4899]" /><span>Status</span></div>
              <p className="text-sm sm:text-base font-bold text-[#18131A]">{event.status}</p>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18131A]">About</h2>
            <p className="text-sm sm:text-base text-[#6B6470] leading-relaxed">{event.description}</p>
          </motion.div>

          {event.organizer && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 sm:p-6 bg-[#FFF1F7] border border-[#F3DCE8] rounded-2xl space-y-3">
            <h3 className="font-bold text-[#18131A]">Organized By</h3>
            <div className="flex items-center gap-3">
              {event.organizer.avatar && <img src={event.organizer.avatar} alt={event.organizer.name} className="w-12 h-12 rounded-full object-cover" />}
              <div><p className="font-bold text-[#18131A]">{event.organizer.name}</p><p className="text-xs sm:text-sm text-[#6B6470]">{event.organizer.role}</p></div>
            </div>
          </motion.div>}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 space-y-4">
          <div className="space-y-2.5">
            {!isRegistered && !hasEventPassed && event.registrationOpen && <GradientButton size="lg" onClick={() => onRegister(event.id)} className="w-full">Register Now</GradientButton>}
            {hasEventPassed && <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-700 text-center font-bold rounded-2xl flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" />Completed</div>}
            {isRegistered && !hasEventPassed && <div className="w-full px-4 py-3 bg-green-100 border border-green-300 text-green-700 text-center font-bold rounded-2xl flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" />Registered ✓</div>}
            {event.hasAttendance && !hasEventPassed && <button onClick={onOpenQRScanner} className="w-full px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#EC4899] to-[#A855F7] hover:shadow-lg rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"><QrCode className="w-5 h-5" />Check-in with QR</button>}
            {event.whatsappLink && !hasEventPassed && <a href={event.whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full px-4 py-3 text-sm font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-300 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5" />Join WhatsApp Group</a>}
          </div>
          {(onEdit || onDelete) && <div className="p-4 bg-[#FFF1F7] border border-[#F3DCE8] rounded-2xl space-y-2">
            {onEdit && <button onClick={() => onEdit(event)} className="w-full px-4 py-2.5 text-sm font-bold text-[#EC4899] hover:text-white bg-white hover:bg-[#EC4899] border border-[#F3DCE8] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"><Edit2 className="w-4 h-4" />Edit Event</button>}
            {onDelete && <button onClick={onDelete} className="w-full px-4 py-2.5 text-sm font-bold text-red-600 hover:text-white bg-white hover:bg-red-600 border border-red-300 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" />Delete Event</button>}
          </div>}
        </motion.div>
      </div>
    </div>
  );
};
