import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, LogOut, User } from 'lucide-react';
import { EventItem } from '../types';
import { useStudentAuth } from '../context/StudentAuthContext';
import { registrationApi, Registrant } from '../api/registrationApi';
import { GradientButton } from '../components/common/GradientButton';

interface MyRegistrationsPageProps {
  events: EventItem[];
  onSelectEvent: (eventId: string) => void;
  onRequestLogin: () => void;
}

export const MyRegistrationsPage: React.FC<MyRegistrationsPageProps> = ({ events, onSelectEvent, onRequestLogin }) => {
  const { student, logout } = useStudentAuth();
  const [registrations, setRegistrations] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) {
      setLoading(false);
      return;
    }
    registrationApi.listForEmail(student.email).then((regs) => {
      setRegistrations(regs);
      setLoading(false);
    });
  }, [student]);

  if (!student) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-pink-100 text-[#EC4899] flex items-center justify-center">
          <User className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-extrabold text-[#18131A]">Sign in to see your events</h1>
        <p className="text-xs text-[#6B6470]">
          Enter your name and email to view the events you've registered for.
        </p>
        <GradientButton size="md" onClick={onRequestLogin}>
          Sign In
        </GradientButton>
      </div>
    );
  }

  const registeredEvents = registrations
    .map((r) => ({ reg: r, evt: events.find((e) => String(e.id) === String(r.event_id)) }))
    .filter((x) => x.evt);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between p-5 bg-white/90 border border-[#F3DCE8] rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#A855F7] flex items-center justify-center text-white font-bold">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-[#18131A]">{student.name}</p>
            <p className="text-xs text-[#6B6470]">{student.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs font-bold text-[#6B6470] hover:text-[#DB2777] px-3 py-2 rounded-xl border border-[#F3DCE8] hover:border-[#EC4899] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      <h2 className="text-lg font-extrabold text-[#18131A]">My Registered Events</h2>

      {loading ? (
        <p className="text-xs text-[#6B6470]">Loading...</p>
      ) : registeredEvents.length === 0 ? (
        <p className="text-xs text-[#6B6470] py-10 text-center">You haven't registered for any events yet.</p>
      ) : (
        <div className="space-y-3">
          {registeredEvents.map(({ reg, evt }) => (
            <button
              key={reg.id}
              onClick={() => evt && onSelectEvent(evt.id)}
              className="w-full flex items-center justify-between text-left p-4 bg-white/90 border border-[#F3DCE8] rounded-2xl hover:border-[#EC4899] transition-colors cursor-pointer"
            >
              <div>
                <p className="text-sm font-bold text-[#18131A]">{evt?.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[#6B6470]">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#EC4899]" />{evt?.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />{evt?.location}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                Registered
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
