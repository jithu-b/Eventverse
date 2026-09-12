import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { EventItem } from '../types';
import { GlassCard } from '../components/common/GlassCard';

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold text-[#18131A] mb-6">Campus Calendar</h1>
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#EC4899]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18131A]">
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
            <span className="text-xs font-bold text-[#DB2777] w-24 text-center">{monthName}</span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-1 rounded-lg hover:bg-pink-50 text-[#6B6470] hover:text-[#EC4899] transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <span key={d} className="font-bold text-[#6B6470] py-1">
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
            return (
              <button
                key={day}
                onClick={() => {
                  if (eventsToday.length > 0) onSelectEvent(eventsToday[0].id);
                }}
                title={hasEvent ? eventsToday.map((e) => e.title).join(', ') : undefined}
                className={`py-1.5 rounded-lg font-semibold transition-all relative ${
                  isToday
                    ? 'bg-[#EC4899] text-white font-bold shadow-xs'
                    : isCompletedDay
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer font-bold'
                    : hasEvent
                    ? 'bg-pink-100 text-[#DB2777] hover:bg-pink-200 cursor-pointer font-bold'
                    : 'text-[#18131A] hover:bg-pink-50/60'
                }`}
              >
                <span>{day}</span>
                {hasEvent && !isToday && (
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
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
    </div>
  );
}
