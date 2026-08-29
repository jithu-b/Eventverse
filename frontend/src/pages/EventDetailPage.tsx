import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  QrCode, 
  Award, 
  Zap, 
  HelpCircle, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { EventItem, Quiz } from '../types';
import { GradientButton } from '../components/common/GradientButton';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedProgressBar } from '../components/common/AnimatedProgressBar';

interface EventDetailPageProps {
  event: EventItem;
  onBack: () => void;
  onRegister: (eventId: string) => void;
  isRegistered: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (eventId: string) => void;
  onOpenQuiz: (quizId: string) => void;
  onOpenQRScanner: () => void;
  onOpenCertificate: () => void;
  quiz?: Quiz;
  onDelete?: () => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event,
  onBack,
  onRegister,
  isRegistered,
  isBookmarked,
  onToggleBookmark,
  onOpenQuiz,
  onOpenQRScanner,
  onOpenCertificate,
  onDelete,
  quiz,
}) => {
  const [copied, setCopied] = useState(false);
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.totalSpots) * 100));

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto" id={`event-detail-${event.id}`}>
      {/* 1. Navigation Back button & Actions Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#18131A] hover:text-[#EC4899] bg-white/80 hover:bg-pink-50 border border-[#F3DCE8] rounded-xl transition-all cursor-pointer shadow-xs"
          id="back-to-events-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(event.id)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
              isBookmarked
                ? 'bg-[#FFF1F7] text-[#EC4899] border-[#EC4899]'
                : 'bg-white text-[#6B6470] border-[#F3DCE8] hover:text-[#EC4899]'
            }`}
            title="Bookmark event"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#EC4899]' : ''}`} />
          </button>
          {onDelete && (
            <button
              onClick={() => { if (confirm('Delete this event?')) onDelete(); }}
              className="p-2.5 rounded-xl border border-[#F3DCE8] bg-white text-[#DB2777] hover:bg-[#FFF1F7] cursor-pointer shadow-xs"
              title="Delete event"
            >
              🗑️
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#18131A] bg-white hover:bg-pink-50 border border-[#F3DCE8] rounded-xl transition-all cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4 text-[#EC4899]" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Large Rounded Event Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#F3DCE8] shadow-2xl shadow-pink-500/10 min-h-[300px] sm:min-h-[380px] flex items-end p-6 sm:p-10">
        {/* Background Image */}
        <img
          src={event.bannerImage}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Sophisticated Dark-to-Light Gradient Overlay for High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

        {/* Overlay Content */}
        <div className="relative z-10 space-y-4 max-w-3xl text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-[#EC4899] text-white rounded-full shadow-xs">
              {event.category}
            </span>
            {event.featured && (
              <span className="px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur-md text-white rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-300" /> Featured Event
              </span>
            )}
            {isRegistered && (
              <span className="px-3 py-1 text-xs font-bold bg-green-500 text-white rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Registered
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-outfit leading-tight drop-shadow-sm">
            {event.title}
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl font-medium">
            {event.subtitle}
          </p>

          {/* Quick Meta Chips */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-white/95 pt-2">
            <div className="flex items-center gap-2 font-semibold">
              <Calendar className="w-4 h-4 text-pink-400" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-300" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-300" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Event Content, Schedule, Speakers, FAQs (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* About this event */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18131A] tracking-tight font-outfit">
              About this event
            </h2>
            <p className="text-sm sm:text-base text-[#6B6470] leading-relaxed">
              {event.detailedAbout || event.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-semibold rounded-xl bg-white border border-[#F3DCE8] text-[#DB2777]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          {/* What you'll learn */}
          {event.whatYouWillLearn && event.whatYouWillLearn.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#18131A] tracking-tight font-outfit">
                What you'll learn
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.whatYouWillLearn.map((item, index) => (
                  <GlassCard key={index} className="p-4 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-pink-100 text-[#EC4899] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#18131A] leading-snug">
                      {item}
                    </span>
                  </GlassCard>
                ))}
              </div>
            </section>
          )}

          {/* Event Schedule Timeline */}
          {event.schedule && event.schedule.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#18131A] tracking-tight font-outfit">
                Schedule
              </h2>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#F3DCE8]">
                {event.schedule.map((slot, index) => (
                  <div key={index} className="relative group">
                    {/* Timeline dot */}
                    <div className="absolute -left-6 sm:-left-8 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#EC4899] shadow-xs group-hover:scale-125 transition-transform" />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-xs font-mono font-bold text-[#EC4899]">
                          {slot.time}
                        </span>
                        {slot.speakerOrLead && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1F7] text-[#DB2777] border border-[#F3DCE8]">
                            {slot.speakerOrLead}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-[#18131A]">
                        {slot.title}
                      </h4>

                      <p className="text-xs text-[#6B6470] leading-relaxed">
                        {slot.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Speakers & Mentors */}
          {event.speakers && event.speakers.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#18131A] tracking-tight font-outfit">
                Speakers & Mentors
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((speaker, index) => (
                  <GlassCard key={index} className="p-5 flex items-start gap-4">
                    <img
                      src={speaker.avatar}
                      alt={speaker.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-pink-400/30 shrink-0"
                    />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#18131A]">{speaker.name}</h4>
                      <p className="text-xs font-medium text-[#EC4899]">{speaker.role}</p>
                      <p className="text-[11px] text-[#6B6470]">{speaker.companyOrDept}</p>
                      {speaker.bio && (
                        <p className="text-[11px] text-[#6B6470] pt-1 leading-snug">{speaker.bio}</p>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </section>
          )}

          {/* Prerequisites */}
          {event.prerequisites && event.prerequisites.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-[#18131A]">Prerequisites</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#6B6470]">
                {event.prerequisites.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Sticky Registration Card & Quick Links (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Main Registration Card */}
          <GlassCard intensity="solid" className="p-6 sm:p-8 space-y-6 border-[#EC4899]/30 shadow-xl shadow-pink-500/10">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#DB2777]">
                  STUDENT REGISTRATION
                </span>
                <span className="px-2.5 py-0.5 text-xs font-extrabold bg-green-100 text-green-800 rounded-full">
                  {event.entryFee || 'Free'}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#18131A] font-outfit">
                {isRegistered ? 'Spot Confirmed 🎉' : 'Ready to join?'}
              </h3>

              <p className="text-xs text-[#6B6470]">
                {isRegistered
                  ? 'Your seat has been reserved. You can view your pass or scan for attendance on event day.'
                  : 'Reserve your spot and be part of the TinkerHub SBCE innovation cohort.'}
              </p>
            </div>

            {/* Large Gradient Action Button */}
            <GradientButton
              size="lg"
              onClick={() => onRegister(event.id)}
              className="w-full"
              id="sticky-register-btn"
            >
              {isRegistered ? 'View My Event Pass 🎟️' : 'Register Now →'}
            </GradientButton>

            {/* Spots capacity indicator */}
            <div className="space-y-2 pt-2 border-t border-[#F3DCE8]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B6470]">{event.totalSpots} spots total</span>
                <span className="font-bold text-[#EC4899]">{event.registeredCount} registered</span>
              </div>

              <AnimatedProgressBar
                progressPercent={percentFilled}
                variant={percentFilled > 85 ? 'amber' : 'gradient'}
                size="sm"
                showPercent={false}
                animateGlow
                id="event-capacity-progress"
              />

              <span className="text-[11px] text-[#6B6470] block text-center">
                {event.totalSpots - event.registeredCount > 0
                  ? `${event.totalSpots - event.registeredCount} seats remaining for SBCE students`
                  : 'Event is fully booked'}
              </span>
            </div>

            {/* Quick Links with pink/purple accent icons */}
            <div className="space-y-2 pt-4 border-t border-[#F3DCE8]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6470] block">
                Interactive Modules
              </span>

              <div className="grid grid-cols-2 gap-2">
                {/* Quiz Quick Link */}
                <button
                  onClick={() => {
                    if (event.quizId) onOpenQuiz(event.quizId);
                    else if (quiz) onOpenQuiz(quiz.id);
                  }}
                  className="p-3 rounded-2xl bg-[#FFF8FC] hover:bg-[#FFF1F7] border border-[#F3DCE8] hover:border-[#EC4899] text-left transition-all cursor-pointer group"
                >
                  <Trophy className="w-4 h-4 text-[#EC4899] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#18131A] block">Blitz Quiz</span>
                  <span className="text-[10px] text-[#6B6470]">Live XP & Score</span>
                </button>

                {/* Attendance Quick Link */}
                <button
                  onClick={onOpenQRScanner}
                  className="p-3 rounded-2xl bg-[#FFF8FC] hover:bg-[#FFF1F7] border border-[#F3DCE8] hover:border-[#22D3EE] text-left transition-all cursor-pointer group"
                >
                  <QrCode className="w-4 h-4 text-[#0891B2] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#18131A] block">Attendance</span>
                  <span className="text-[10px] text-[#6B6470]">QR Check-in</span>
                </button>

                {/* Certificate Quick Link */}
                <button
                  onClick={onOpenCertificate}
                  className="p-3 rounded-2xl bg-[#FFF8FC] hover:bg-[#FFF1F7] border border-[#F3DCE8] hover:border-pink-400 text-left transition-all cursor-pointer group"
                >
                  <Award className="w-4 h-4 text-[#DB2777] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#18131A] block">Certificate</span>
                  <span className="text-[10px] text-[#6B6470]">Verify & View</span>
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Organizer Details Card */}
          <GlassCard className="p-5 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6470]">
              Hosted by
            </span>
            <div className="flex items-center gap-3">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-pink-400/30"
              />
              <div>
                <h4 className="text-xs font-bold text-[#18131A]">{event.organizer.name}</h4>
                <p className="text-[11px] text-[#6B6470]">{event.organizer.role}</p>
              </div>
            </div>
            <p className="text-[11px] text-[#6B6470] flex items-center gap-1.5 pt-1 border-t border-[#F3DCE8]/60">
              <Mail className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>{event.organizer.contactEmail}</span>
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
