import React, { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { EventItem } from '../../types';
import { getLatestEvent, getNextUpcomingEvent } from '../../api/eventApi';
import { GradientButton } from '../common/GradientButton';

const SESSION_KEY = 'eventverse_welcome_shown';

interface Props {
  onRegister: (eventId: string) => void;
}

export const WelcomeEventPopup: React.FC<Props> = ({ onRegister }) => {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const latest = await getNextUpcomingEvent();
      if (latest) {
        setEvent(latest);
        setVisible(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || !event) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-sm bg-[#141012] rounded-3xl shadow-2xl overflow-hidden">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shadow"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        {event.bannerImage && (
          <img src={event.bannerImage} alt={event.title} className="w-full h-40 object-cover" />
        )}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E04848]">
            <Sparkles className="w-3.5 h-3.5" /> Just Announced
          </div>
          <h2 className="text-lg font-bold text-white">{event.title}</h2>
          <p className="text-sm text-[#B3ABAB] line-clamp-2">{event.description}</p>
          <p className="text-xs text-[#B3ABAB]">{event.date} · {event.location}</p>
          <GradientButton
            size="md"
            className="w-full justify-center"
            onClick={() => {
              setVisible(false);
              onRegister(event.id);
            }}
          >
            Register Now
          </GradientButton>
        </div>
      </div>
    </div>
  );
};
