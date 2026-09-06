import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  Download, 
  Share2, 
  Sparkles, 
  User, 
  Mail, 
  GraduationCap, 
  Award,
  Check,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { EventItem, UserProfile } from '../../types';
import { useStudentAuth } from '../../context/StudentAuthContext';
import { Modal } from '../common/Modal';
import { GradientButton } from '../common/GradientButton';
import { AnimatedProgressBar } from '../common/AnimatedProgressBar';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  user: UserProfile;
  onConfirmRegistration: (eventId: string, details: { name: string; email: string; dept: string; year: string }) => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  isOpen,
  onClose,
  event,
  user,
  onConfirmRegistration,
}) => {
  const { student } = useStudentAuth();
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
  });
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const customFields = event.registrationFields || [];

  const setAnswer = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleCheckbox = (fieldId: string, option: string) => {
    setAnswers((prev) => {
      const current: string[] = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [fieldId]: next };
    });
  };

  const spotsFilledPercent = Math.min(100, Math.round((event.registeredCount / event.totalSpots) * 100));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmRegistration(event.id, { name: formData.name, email: formData.email, dept: '', year: '' }, answers);
    setIsRegisteredSuccess(true);

    // Fire festive campus confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EC4899', '#DB2777', '#A855F7', '#22D3EE', '#F3E8FF']
      });
    } catch {
      // ignore
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`I just registered for ${event.title} on EventVerse - TinkerHub SBCE! 🎟️`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsRegisteredSuccess(false);
        onClose();
      }}
      maxWidth={isRegisteredSuccess ? 'xl' : 'lg'}
      id="event-registration-modal"
    >
      {!isRegisteredSuccess ? (
        <div className="space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F3DCE8]">
            <div className="w-12 h-12 rounded-2xl bg-pink-100/90 text-[#EC4899] flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-[#FFF1F7] text-[#DB2777] rounded-full border border-[#F3DCE8]">
                {event.category}
              </span>
              <h3 className="text-lg font-bold text-[#18131A] tracking-tight mt-0.5">
                Register for {event.title}
              </h3>
            </div>
          </div>

          {/* Event Quick Summary card with Live Spots Progress Bar */}
          <div className="p-4 bg-[#FFF8FC] rounded-2xl border border-[#F3DCE8] text-xs text-[#6B6470] space-y-3">
            <div className="flex items-center gap-2 font-semibold text-[#18131A]">
              <Calendar className="w-4 h-4 text-[#EC4899]" />
              <span>{event.date} · {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#22D3EE]" />
              <span>{event.location}</span>
            </div>

            {/* Animated Capacity Progress Bar */}
            <div className="space-y-1 pt-1 border-t border-[#F3DCE8]/60">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#18131A]">Seat Availability</span>
                <span className="font-mono text-[#DB2777] font-bold">
                  {event.totalSpots - event.registeredCount} spots remaining ({spotsFilledPercent}% booked)
                </span>
              </div>
              <AnimatedProgressBar
                progressPercent={spotsFilledPercent}
                variant={spotsFilledPercent > 80 ? 'amber' : 'gradient'}
                size="sm"
                showPercent={false}
                animateGlow
              />
            </div>
          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#18131A] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#6B6470]" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18131A] mb-1.5">College Email ID</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#6B6470]" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none"
                />
              </div>
            </div>

            {customFields.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-[#F3DCE8]">
                {customFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-xs font-bold text-[#18131A] mb-1.5">
                      {field.label}{field.required && <span className="text-[#EC4899]"> *</span>}
                    </label>

                    {field.type === 'short_text' && (
                      <input
                        type="text"
                        required={field.required}
                        value={answers[field.id] || ''}
                        onChange={(e) => setAnswer(field.id, e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none"
                      />
                    )}

                    {field.type === 'paragraph' && (
                      <textarea
                        required={field.required}
                        rows={3}
                        value={answers[field.id] || ''}
                        onChange={(e) => setAnswer(field.id, e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none"
                      />
                    )}

                    {field.type === 'dropdown' && (
                      <select
                        required={field.required}
                        value={answers[field.id] || ''}
                        onChange={(e) => setAnswer(field.id, e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none cursor-pointer"
                      >
                        <option value="">Select an option...</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {field.type === 'multiple_choice' && (
                      <div className="space-y-1.5">
                        {(field.options || []).map((opt) => (
                          <label key={opt} className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer">
                            <input
                              type="radio"
                              name={field.id}
                              required={field.required}
                              checked={answers[field.id] === opt}
                              onChange={() => setAnswer(field.id, opt)}
                              className="accent-[#EC4899]"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {field.type === 'checkboxes' && (
                      <div className="space-y-1.5">
                        {(field.options || []).map((opt) => (
                          <label key={opt} className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Array.isArray(answers[field.id]) && answers[field.id].includes(opt)}
                              onChange={() => toggleCheckbox(field.id, opt)}
                              className="accent-[#EC4899]"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-[#6B6470] hover:text-[#18131A] cursor-pointer"
              >
                Cancel
              </button>
              <GradientButton type="submit" size="md">
                Confirm Registration 🎟️
              </GradientButton>
            </div>
          </form>
        </div>
      ) : (
        /* Holographic Digital Pass Preview */
        <div className="space-y-6 text-center">
          <div className="inline-flex p-3 rounded-full bg-green-100 text-green-600 mb-1 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-[#18131A] font-outfit">
              You’re In! Spot Confirmed 🎉
            </h3>
            <p className="text-xs text-[#6B6470] mt-1">
              Your official digital event ticket has been generated and linked to your student profile.
            </p>
          </div>

          {/* Ticket pass card */}
          <div className="relative mx-auto max-w-md bg-gradient-to-br from-white via-[#FFF8FC] to-[#FFF1F7] border-2 border-dashed border-[#EC4899]/50 rounded-3xl p-6 shadow-xl shadow-pink-500/10 text-left overflow-hidden">
            {/* Watermark logo */}
            <div className="absolute -right-8 -bottom-8 w-36 h-36 opacity-5 pointer-events-none">
              <Sparkles className="w-full h-full text-pink-600" />
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#F3DCE8]">
              <div>
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#DB2777]">
                  TINKERHUB SBCE OFFICIAL PASS
                </span>
                <h4 className="text-base font-extrabold text-[#18131A] line-clamp-1">{event.title}</h4>
              </div>
              <div className="px-2.5 py-1 text-[10px] font-bold bg-green-100 text-green-800 rounded-lg">
                CONFIRMED
              </div>
            </div>

            <div className="py-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-semibold uppercase text-[#6B6470] block">Attendee</span>
                <span className="font-bold text-[#18131A]">{formData.name}</span>
                <span className="text-[10px] text-[#6B6470] block">{formData.dept}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase text-[#6B6470] block">Date & Venue</span>
                <span className="font-bold text-[#18131A]">{event.date}</span>
                <span className="text-[10px] text-[#6B6470] block truncate">{event.location}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase text-[#6B6470] block">Ticket ID</span>
                <span className="font-mono text-xs font-bold text-[#DB2777]">
                  TH-SBCE-{Math.floor(100000 + Math.random() * 900000)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase text-[#6B6470] block">Entry Gate</span>
                <span className="font-bold text-[#18131A]">Hall 1 · Main Block</span>
              </div>
            </div>

            {/* QR Code simulation bar */}
            <div className="pt-3 border-t border-[#F3DCE8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white rounded-xl border border-[#F3DCE8] shadow-xs">
                  <QrCode className="w-8 h-8 text-[#18131A]" />
                </div>
                <div className="text-[10px] text-[#6B6470]">
                  <span>Scan for instant check-in</span>
                  <p className="font-mono text-[9px] text-[#EC4899]">VERIFIED-ATTENDEE</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#6B6470] bg-white px-2 py-1 rounded-lg border border-[#F3DCE8]">
                Confirmed
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-white hover:bg-pink-50 text-[#18131A] border border-[#F3DCE8] rounded-xl transition-all cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4 text-[#EC4899]" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Share Pass'}</span>
            </button>

            <GradientButton
              size="md"
              onClick={() => {
                setIsRegisteredSuccess(false);
                onClose();
              }}
            >
              Done & Go to Dashboard →
            </GradientButton>
          </div>
        </div>
      )}
    </Modal>
  );
};

