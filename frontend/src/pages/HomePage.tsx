import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  PlusCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Award, 
  Users, 
  Zap, 
  Code2, 
  Laptop, 
  Flame, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { EventItem, Quiz, UserRole, UserProfile } from '../types';
import { GradientButton } from '../components/common/GradientButton';
import { StatCard } from '../components/common/StatCard';
import { EventCard } from '../components/events/EventCard';
import { GlassCard } from '../components/common/GlassCard';
import tinkerhubLogo from '../assets/tinkerhub-logo.png';

interface HomePageProps {
  user?: UserProfile;
  events: EventItem[];
  quizzes: Quiz[];
  onNavigate: (view: string, eventId?: string) => void;
  onRegisterEvent: (eventId: string) => void;
  registeredEventIds: string[];
  bookmarkedEventIds: string[];
  onToggleBookmark: (eventId: string) => void;
  onCreateEvent: () => void;
  onOpenQuiz: (quizId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  events = [],
  quizzes = [],
  onNavigate,
  onRegisterEvent,
  registeredEventIds = [],
  bookmarkedEventIds = [],
  onToggleBookmark,
  onCreateEvent,
  onOpenQuiz,
}) => {
  const safeEvents = Array.isArray(events) ? events : [];
  const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];
  const upcomingEvents = [...safeEvents]
    .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime())
    .slice(0, 6);
  const featuredQuiz = safeQuizzes[0];

  // Word-by-word reveal for hero title
  const titleWords = ['Where', 'campus', 'events', 'come', 'alive.'];

  return (
    <div className="space-y-20 sm:space-y-28" id="home-page-container">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-8 sm:pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Community Pill */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#F3DCE8] shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#DB2777]">
                  TINKERHUB SBCE CHAPTER
                </span>
                <span className="text-xs text-[#6B6470]">· Academic Year 2026</span>
              </motion.div>

              {/* Main Headline with word-by-word staggered reveal */}
              <div className="space-y-2">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#EC4899] block font-outfit"
                >
                  EVENTVERSE
                </motion.span>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#18131A] font-outfit leading-[1.08]">
                  {titleWords.map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={index >= 3 ? 'text-gradient-pink inline-block mr-3 sm:mr-4' : 'inline-block mr-3 sm:mr-4'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>
              </div>

              {/* Supporting Text */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-base sm:text-lg text-[#6B6470] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
              >
                Discover events, join competitions, test your skills, and stay connected with the <strong>TinkerHub SBCE</strong> community.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <GradientButton
                  size="lg"
                  onClick={() => onNavigate('discover')}
                  icon={<ArrowRight className="w-4 h-4" />}
                  id="hero-explore-events-cta"
                >
                  Explore Events →
                </GradientButton>

                {user?.role === 'admin' && (
                  <button
                    onClick={onCreateEvent}
                    className="px-6 py-3.5 text-sm font-bold text-[#18131A] hover:text-[#EC4899] bg-white/90 hover:bg-[#FFF1F7] border border-[#F3DCE8] hover:border-[#EC4899] rounded-2xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    id="hero-create-event-cta"
                  >
                    <PlusCircle className="w-4 h-4 text-[#EC4899]" />
                    <span>Create an Event</span>
                  </button>
                )}
              </motion.div>

              {/* Trust & Campus Tag */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center lg:justify-start gap-3 text-xs text-[#6B6470] pt-2"
              >
                <span>Joined by <strong>TinkerHub</strong> students across SBCE departments</span>
              </motion.div>
            </div>

            {/* Right Visual Floating Showcase Cards */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[420px]">
              {/* Central Glowing Halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-400/20 via-purple-300/20 to-pink-200/30 rounded-full filter blur-3xl" />

              {/* Floating Card 1: TechFest 2026 */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute top-4 sm:top-6 -right-2 sm:right-4 z-20 w-64 sm:w-72 bg-white/95 backdrop-blur-xl border border-[#F3DCE8] rounded-3xl p-4 sm:p-5 shadow-xl shadow-pink-500/10 animate-float-gentle"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 rounded-full">
                    {upcomingEvents[0]?.category || 'Event'}
                  </span>
                  <span className="text-[10px] font-bold text-green-700 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                    {upcomingEvents[0]?.registrationOpen === false ? 'Closed' : 'Open'}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-[#18131A] line-clamp-1">
                  {upcomingEvents[0]?.title || 'No upcoming events'}
                </h4>
                <p className="text-xs text-[#6B6470] mt-0.5">{upcomingEvents[0]?.date} · {upcomingEvents[0]?.time}</p>

                <div className="mt-3 pt-3 border-t border-[#F3DCE8] flex items-center justify-between text-xs">
                  <span className="text-[#6B6470] text-[11px]">{upcomingEvents[0]?.totalSpots ?? 0} Spots</span>
                  <span className="font-bold text-[#EC4899]">{upcomingEvents[0]?.registeredCount ?? 0} Registered</span>
                </div>
              </motion.div>

              {/* Floating Card 2: AI Workshop */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="absolute bottom-6 sm:bottom-8 -left-2 sm:left-2 z-20 w-64 sm:w-72 bg-white/95 backdrop-blur-xl border border-[#F3DCE8] rounded-3xl p-4 sm:p-5 shadow-xl shadow-pink-500/10 animate-float-delayed"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-pink-100 text-pink-700 rounded-full">
                    {upcomingEvents[1]?.category || 'Event'}
                  </span>
                  <span className="text-[10px] font-bold text-[#DB2777]">{upcomingEvents[1]?.location?.split('·')[0] || 'SBCE Campus'}</span>
                </div>

                <h4 className="text-sm font-extrabold text-[#18131A] line-clamp-1">
                  {upcomingEvents[1]?.title || 'More events coming soon'}
                </h4>
                <p className="text-xs text-[#6B6470] mt-0.5">{upcomingEvents[1]?.date} · {upcomingEvents[1]?.time}</p>

                <div className="mt-3 pt-3 border-t border-[#F3DCE8] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-[#6B6470]">
                    <Users className="w-3.5 h-3.5 text-[#EC4899]" />
                    <span>{(upcomingEvents[1]?.totalSpots ?? 0) - (upcomingEvents[1]?.registeredCount ?? 0)} spots left</span>
                  </div>
                  <span className="text-[11px] font-bold text-green-700">{upcomingEvents[1]?.registeredCount ?? 0} Registered</span>
                </div>
              </motion.div>

              {/* Central Graphic Element */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-[#EC4899] via-[#DB2777] to-[#A855F7] p-1 shadow-2xl shadow-pink-500/20"
              >
                <div className="w-full h-full bg-white/90 backdrop-blur-md rounded-full flex flex-col items-center justify-center p-4 text-center">
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#A855F7] flex items-center justify-center text-white mb-2 shadow-md overflow-hidden">
                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_12px_3px_rgba(255,255,255,0.55)] pointer-events-none" />
                    <img
                      src={tinkerhubLogo}
                      alt="TinkerHub"
                      className="w-8 h-8 object-contain relative z-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                    />
                  </div>
                  <span className="text-sm font-extrabold text-[#18131A] font-outfit">
                    TinkerHub
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#DB2777]">
                    Innovate · Build · Share
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS COUNTER ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            label="Events Hosted"
            value={`${safeEvents.length}`}
            numericTarget={safeEvents.length}
            subtext="Workshops & hackathons"
            icon={Calendar}
            color="pink"
            trend="Growing every semester"
            id="stat-events-hosted"
          />
          <StatCard
            label="Participants"
            value="2.4K+"
            numericTarget={2400}
            suffix="+"
            subtext="Active student builders"
            icon={Users}
            color="purple"
            trend="Across 6 departments"
            id="stat-participants"
          />
          <StatCard
            label="Community Events"
            value="35+"
            numericTarget={35}
            suffix="+"
            subtext="Meetups & open talks"
            icon={Trophy}
            color="pink"
            trend="Weekly campus meetups"
            id="stat-community-events"
          />
        </div>
      </section>

      {/* 3. UPCOMING EVENTS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#DB2777]">
                CAMPUS CALENDAR
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18131A] tracking-tight font-outfit mt-1">
              Upcoming Events
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6470]">
              Handcrafted workshops, hackathons, and speaker sessions designed for student engineers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('discover')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#DB2777] hover:text-[#EC4899] transition-colors cursor-pointer group"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {upcomingEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onSelect={(id) => onNavigate('event-detail', id)}
              onRegister={onRegisterEvent}
              isRegistered={registeredEventIds.includes(evt.id)}
              isBookmarked={bookmarkedEventIds.includes(evt.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE QUIZ & LIVE LEADERBOARD TEASER BANNER */}
      {featuredQuiz && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#FFF1F7] via-white to-[#F3E8FF] border border-[#F3DCE8] p-8 sm:p-12 overflow-hidden shadow-lg shadow-pink-500/5">
            {/* Background glowing orb */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-pink-300/30 filter blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-pink-100 text-[#DB2777] rounded-full border border-pink-200">
                  <Flame className="w-3.5 h-3.5 text-[#EC4899]" />
                  <span>CAMPUS BLITZ QUIZ IS LIVE</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18131A] tracking-tight font-outfit">
                  {featuredQuiz.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#6B6470] max-w-xl leading-relaxed">
                  {featuredQuiz.description} Test your technical knowledge in 3 minutes, earn instant XP, and qualify for verified digital credentials on the SBCE leaderboard.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <GradientButton
                    size="md"
                    onClick={() => onOpenQuiz(featuredQuiz.id)}
                    icon={<Zap className="w-4 h-4" />}
                  >
                    Start Timed Quiz Now ⚡
                  </GradientButton>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div className="p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-[#F3DCE8] shadow-xl text-center space-y-3 max-w-xs w-full">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#A855F7] text-white flex items-center justify-center mx-auto shadow-md">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#18131A] block">Top Campus Rank #1</span>
                  <span className="text-lg font-extrabold text-gradient-pink block font-outfit">Aaditya Nair (2,450 XP)</span>
                  <p className="text-[10px] text-[#6B6470]">142 students participated this week</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. WHY TINKERHUB SBCE COMMUNITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#DB2777]">
            COMMUNITY FIRST
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18131A] font-outfit">
            Why builders love TinkerHub SBCE
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6470]">
            Empowering students to transition from textbook theory to production-grade engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#EC4899] flex items-center justify-center shadow-xs">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#18131A]">Hands-On Labs & Sprints</h3>
            <p className="text-xs text-[#6B6470] leading-relaxed">
              Every workshop centers on live building. You walk out with deployed web apps, machine learning models, and real GitHub repositories.
            </p>
          </GlassCard>

          <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#A855F7] flex items-center justify-center shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#18131A]">Verifiable Credentials</h3>
            <p className="text-xs text-[#6B6470] leading-relaxed">
              Earn tamper-proof certificates with QR verification codes for your LinkedIn profile, hackathon submissions, and resume portfolios.
            </p>
          </GlassCard>

          <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-[#0891B2] flex items-center justify-center shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#18131A]">Inclusive Peer Network</h3>
            <p className="text-xs text-[#6B6470] leading-relaxed">
              Connect with seniors, mentors, alumni, and industry engineers who provide real guidance, code reviews, and career insights.
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};
