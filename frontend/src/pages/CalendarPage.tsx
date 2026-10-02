import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { EventItem } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { photoApi, Photo } from '../api/photoApi';

interface CalendarPageProps {
  events: EventItem[];
  onSelectEvent: (eventId: string) => void;
}

export function CalendarPage({ events, onSelectEvent }: CalendarPageProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const safeEvents = events || [];

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getEventsForDay = (day: number) => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth() + 1;
    const target = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return safeEvents.filter((e) => e?.rawDate === target);
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthPrefix = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-`;
  const monthEventCount = safeEvents.filter((e) => e?.rawDate?.startsWith(monthPrefix)).length;

  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  useEffect(() => {
    photoApi.list().then(setAllPhotos).catch(() => setAllPhotos([]));
  }, []);

  const monthEventIds = new Set(
    safeEvents.filter((e) => e?.rawDate?.startsWith(monthPrefix)).map((e) => String(e.id))
  );
  const monthPhotos = allPhotos.filter((p) => monthEventIds.has(String(p.event_id)));

  const floatingPhotos = React.useMemo(() => {
    const seeded = (seed: number) => {
      const x = Math.sin(seed * 999) * 10000;
      return x - Math.floor(x);
    };
    return monthPhotos.map((photo, i) => ({
      photo,
      duration: 3 + seeded(i + 41) * 2,
      delay: seeded(i + 51) * 2,
      drift: 8 + seeded(i + 61) * 6,
    }));
  }, [monthPhotos, monthPrefix]);

  return (
    <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#18131A] tracking-tight mb-6">
        Campus <span className="bg-gradient-to-br from-[#DB2777] to-[#9333EA] bg-clip-text text-transparent">Calendar</span>
      </h1>
      <div className="relative overflow-hidden rounded-[2rem] p-[1px] mb-6 bg-gradient-to-br from-white/60 via-pink-200/40 to-purple-300/40 shadow-xl shadow-pink-200/40">
        <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-gradient-to-br from-pink-50/90 via-rose-50/80 to-purple-50/90 backdrop-blur-xl p-6 sm:p-8 lg:p-10">
          {/* Soft glow orbs — pastel, low opacity */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-pink-200/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-purple-200/40 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-rose-100/30 blur-2xl" />
          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(#DB2777 1px, transparent 1px)`,
              backgroundSize: '22px 22px',
            }}
          />
          {/* Top sheen line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

          <div className="relative flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="flex items-center gap-1.5 text-[#DB2777]/70 text-[11px] font-bold uppercase tracking-[0.15em] mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]/70 animate-pulse" />
                Now Viewing
              </p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-[#DB2777] to-[#9333EA] bg-clip-text text-transparent tracking-tight leading-[1.15] pb-1">
                {monthName}
              </h2>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md rounded-2xl pl-4 pr-5 py-3 lg:px-7 lg:py-4 border border-white/80 shadow-sm">
              <span className="text-3xl lg:text-4xl font-extrabold text-[#DB2777] leading-none tabular-nums">
                {monthEventCount}
              </span>
              <span className="text-[#6B6470] text-xs lg:text-sm font-bold leading-tight max-w-[64px] lg:max-w-[80px]">
                {monthEventCount === 1 ? 'event this month' : 'events this month'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <GlassCard className="p-5 lg:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#EC4899]" />
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-[#18131A]">
              Campus Calendar
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-1 rounded-lg hover:bg-pink-50 text-[#6B6470] hover:text-[#EC4899] transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-display text-xs font-bold text-[#DB2777] w-24 text-center">{monthName}</span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-1 rounded-lg hover:bg-pink-50 text-[#6B6470] hover:text-[#EC4899] transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 lg:gap-2 text-center text-[10px] lg:text-xs">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <span key={d} className="font-bold text-[#6B6470] py-1 lg:py-2">
              {d}
            </span>
          ))}

          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <span key={`blank-${i}`} className="py-1.5 opacity-0" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const eventsToday = getEventsForDay(day);
            const hasEvent = eventsToday.length > 0;
            const isCompletedDay = hasEvent && dayDate.getTime() < today.getTime();
            const isToday = dayDate.getTime() === today.getTime();
            const bannerImg = isCompletedDay ? eventsToday[0]?.bannerImage : null;
            return (
              <button
                key={day}
                onClick={() => {
                  if (eventsToday.length > 0) onSelectEvent(eventsToday[0].id);
                }}
                title={hasEvent ? eventsToday.map((e) => e.title).join(', ') : undefined}
                style={
                  bannerImg
                    ? {
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.72), rgba(255,255,255,0.72)), url(${bannerImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : undefined
                }
                className={`py-1.5 lg:py-3 rounded-lg lg:rounded-xl font-semibold transition-all relative overflow-hidden lg:text-base ${
                  isToday
                    ? 'bg-[#EC4899] text-white font-bold shadow-xs'
                    : isCompletedDay
                    ? 'hover:brightness-95 cursor-pointer font-bold' + (bannerImg ? ' text-green-800' : ' bg-green-100 text-green-700')
                    : hasEvent
                    ? 'bg-pink-100 text-[#DB2777] hover:bg-pink-200 cursor-pointer font-bold'
                    : 'text-[#18131A] hover:bg-pink-50/60'
                }`}
              >
                <span className="relative z-10">{day}</span>
                {hasEvent && !isToday && (
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full z-10 ${
                      isCompletedDay ? 'bg-green-600' : 'bg-[#EC4899]'
                    }`}
                  />
                )}
              </button>
            );
          })}
          <div className="col-span-7 flex items-center justify-center gap-4 pt-2 text-[10px] font-semibold text-[#6B6470]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#EC4899]" /> Upcoming
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600" /> Completed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#EC4899] ring-2 ring-pink-200" /> Today
            </span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4 mt-6 overflow-hidden">
        <h4 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-[#18131A] mb-3 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#EC4899]" />
          {monthName} Gallery
        </h4>
        {monthPhotos.length === 0 ? (
          <div className="h-32 rounded-xl bg-pink-50 flex items-center justify-center text-xs text-[#6B6470]">
            No photos for this month yet
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 px-1">
            <style>{`
              @keyframes floatDrift {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(calc(var(--drift) * -1px)); }
              }
            `}</style>
            {floatingPhotos.map(({ photo, duration, delay, drift }) => (
              <div key={photo.id} className="shrink-0 text-center">
                <img
                  src={photo.photo_url}
                  alt={photo.caption || photo.event_title}
                  className="w-28 h-28 lg:w-36 lg:h-36 object-cover rounded-xl shadow-md ring-2 ring-white"
                  style={{
                    ['--drift' as any]: drift,
                    animation: `floatDrift ${duration}s ease-in-out ${delay}s infinite`,
                  }}
                />
                <p className="text-[10px] font-semibold text-[#6B6470] mt-1 max-w-28 truncate">
                  {photo.event_title}
                </p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
