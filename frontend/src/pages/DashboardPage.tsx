import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Award, 
  Trophy, 
  Users, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  QrCode, 
  PlusCircle, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Check, 
  ChevronRight,
  ChevronLeft,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserProfile, 
  EventItem, 
  Quiz, 
  Certificate, 
  ActivityItem, 
  UserRole,
  AttendanceRecord 
} from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { GradientButton } from '../components/common/GradientButton';
import { adminApi } from '../api/adminApi.js';

interface DashboardPageProps {
  user: UserProfile;
  events: EventItem[];
  quizzes: Quiz[];
  activities: ActivityItem[];
  onSelectEvent: (eventId: string) => void;
  onOpenCertificate: (cert: Certificate) => void;
  onOpenQuiz: (quizId: string) => void;
  onOpenQRScanner: (event?: EventItem) => void;
  onCreateEvent: () => void;
  onRoleChange: (role: UserRole) => void;
  onClaimCertificate?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  events,
  quizzes,
  activities,
  onSelectEvent,
  onOpenCertificate,
  onOpenQuiz,
  onOpenQRScanner,
  onCreateEvent,
  onRoleChange,
  onClaimCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'calendar' | 'quizzes' | 'certificates' | 'users'>('overview');
  const [eventFilterTab, setEventFilterTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');

  // Calendar month state
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7)); // August 2026

  const [adminOverview, setAdminOverview] = useState<{
    total_users: number;
    total_events: number;
    total_quizzes: number;
    total_registrations: number;
    attendance_rate: number;
    total_certificates: number;
  } | null>(null);

  const [adminActivities, setAdminActivities] = useState<ActivityItem[] | null>(null);

  useEffect(() => {
    if (user.role === 'admin') {
      adminApi.getOverview()
        .then((res: any) => setAdminOverview(res.data))
        .catch((err: any) => console.error('Failed to load admin overview', err));
      adminApi.getActivity()
        .then((res: any) => setAdminActivities(res.data.activities))
        .catch((err: any) => console.error('Failed to load admin activity', err));
    }
  }, [user.role]);

  const now = new Date();
  const upcomingEventsList = events
    .filter((e) => new Date(e.rawDate) >= now)
    .sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());
  const upcomingCount = upcomingEventsList.length;
  const nextEventTitle = upcomingEventsList[0]?.title || 'No upcoming events';

  // Registered events list
  const safeEvents = events || [];
  const safeRegisteredIds = user?.registeredEventIds || [];
  const registeredEvents = safeEvents.filter((e) => safeRegisteredIds.includes(e?.id));
  const upcomingRegistered = registeredEvents.filter((e) => e?.status === 'Upcoming');
  const completedRegistered = registeredEvents.filter((e) => e?.status === 'Completed');

  // Calendar helpers
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
    <div className="space-y-8 max-w-7xl mx-auto" id="dashboard-container">
      {/* 1. Header Greeting & Role Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 bg-gradient-to-r from-white via-[#FFF8FC] to-[#FFF1F7] rounded-3xl border border-[#F3DCE8] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#18131A] font-outfit">
              Good morning, {user.name.split(' ')[0]} 👋
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-pink-100 text-[#DB2777] rounded-full border border-pink-200">
              {user.role} view
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B6470]">
            Here’s what’s happening in <strong>EventVerse</strong> across TinkerHub SBCE today.
          </p>
        </div>

          {user.role === 'admin' && (
            <GradientButton
              size="sm"
              onClick={onCreateEvent}
              icon={<PlusCircle className="w-4 h-4" />}
            >
              Create Event
            </GradientButton>
          )}
      </div>

      {/* 2. Top Statistic Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label={user.role === 'participant' ? 'Registered Events' : 'Total Events Managed'}
          value={user.role === 'participant' ? '12' : `${events.length}`}
          numericTarget={user.role === 'participant' ? 12 : events.length}
          subtext={user.role === 'participant' ? `${upcomingCount} upcoming on campus` : 'Active chapter events'}
          icon={CalendarIcon}
          color="pink"
          trend={user.role === 'admin' && adminOverview ? `${adminOverview.total_registrations} total registrations` : '+2 registered this month'}
          id="dash-stat-1"
        />
        <StatCard
          label="Upcoming Events"
          value={`${upcomingCount}`}
          numericTarget={upcomingCount}
          subtext={`Next: ${nextEventTitle}`}
          icon={Clock}
          color="purple"
          trend={upcomingCount > 0 ? 'On the calendar' : 'Nothing scheduled'}
          id="dash-stat-2"
        />
        <StatCard
          label={user.role === 'admin' ? 'Total Quizzes' : 'Quizzes Completed'}
          value={`${user.role === 'admin' && adminOverview ? adminOverview.total_quizzes : (user?.quizScores?.length || 0)}`}
          numericTarget={user.role === 'admin' && adminOverview ? adminOverview.total_quizzes : (user?.quizScores?.length || 0)}
          subtext={user.role === 'admin' ? 'Across all events' : 'Based on your attempts'}
          icon={Trophy}
          color="pink"
          trend={quizzes.length > 0 ? `${quizzes.length} live now` : 'None yet'}
          id="dash-stat-4"
        />
      </div>

      {/* 3. Main Dashboard Body: Left content (8 cols) + Right Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Registered Events / Organizer Management / Admin Tables */}
        <div className="lg:col-span-8 space-y-8">
          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-2 border-b border-[#F3DCE8] pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#FFF1F7] text-[#DB2777] border border-[#F3DCE8]'
                  : 'text-[#6B6470] hover:text-[#18131A]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-[#FFF1F7] text-[#DB2777] border border-[#F3DCE8]'
                  : 'text-[#6B6470] hover:text-[#18131A]'
              }`}
            >
              My Events ({registeredEvents.length})
            </button>
            <button
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activeTab === 'quizzes'
                  ? 'bg-[#FFF1F7] text-[#DB2777] border border-[#F3DCE8]'
                  : 'text-[#6B6470] hover:text-[#18131A]'
              }`}
            >
              Quizzes & XP
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-[#FFF1F7] text-[#DB2777] border border-[#F3DCE8]'
                    : 'text-[#6B6470] hover:text-[#18131A]'
                }`}
              >
                User Management
              </button>
            )}
          </div>

          {/* TAB 1: OVERVIEW / UPCOMING EVENTS SECTION */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Upcoming Events Horizontal Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-[#18131A] font-outfit">
                    Upcoming Registered Events
                  </h3>
                  <span className="text-xs font-semibold text-[#DB2777]">
                    {upcomingRegistered.length} Confirmed Seats
                  </span>
                </div>

                {upcomingRegistered.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingRegistered.map((evt) => (
                      <GlassCard
                        key={evt.id}
                        hoverEffect
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-4">
                          <img
                            src={evt.thumbnail}
                            alt={evt.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 ring-1 ring-pink-200"
                          />
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-pink-100 text-[#DB2777] rounded-full">
                              {evt.category}
                            </span>
                            <h4
                              onClick={() => onSelectEvent(evt.id)}
                              className="text-sm sm:text-base font-bold text-[#18131A] hover:text-[#EC4899] transition-colors cursor-pointer"
                            >
                              {evt.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B6470]">
                              <span className="flex items-center gap-1 font-semibold text-[#18131A]">
                                <CalendarIcon className="w-3.5 h-3.5 text-[#EC4899]" />
                                {evt.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-[#A855F7]" />
                                {evt.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />
                                {evt.location.split('·')[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3DCE8]">
                          <button
                            onClick={() => onOpenQRScanner(evt)}
                            className="p-2 text-[#6B6470] hover:text-[#EC4899] bg-[#FFF8FC] border border-[#F3DCE8] rounded-xl hover:bg-pink-50 transition-colors"
                            title="Scan QR Attendance"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <GradientButton
                            size="sm"
                            onClick={() => onSelectEvent(evt.id)}
                            icon={<ArrowRight className="w-3.5 h-3.5" />}
                          >
                            Digital Pass
                          </GradientButton>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-white/80 rounded-2xl border border-[#F3DCE8] space-y-3">
                    <CalendarIcon className="w-8 h-8 text-[#EC4899] mx-auto" />
                    <p className="text-xs text-[#6B6470]">You have not registered for any upcoming events yet.</p>
                  </div>
                )}
              </div>

              {/* Admin / Organizer Management Block */}
              {user.role === 'admin' && (
                <div className="p-6 bg-white/90 rounded-3xl border border-[#F3DCE8] space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#EC4899]" />
                      <h4 className="text-sm font-bold text-[#18131A]">Admin Campus Quick Management</h4>
                    </div>
                    <span className="text-xs text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-full">
                      System Operational
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-[#FFF8FC] rounded-xl border border-[#F3DCE8]">
                      <span className="text-[#6B6470] text-[10px] block">Total Users</span>
                      <span className="text-base font-bold text-[#18131A]">{adminOverview ? adminOverview.total_users.toLocaleString() : '—'}</span>
                    </div>
                    <div className="p-3 bg-[#FFF8FC] rounded-xl border border-[#F3DCE8]">
                      <span className="text-[#6B6470] text-[10px] block">Registrations</span>
                      <span className="text-base font-bold text-[#EC4899]">{adminOverview ? adminOverview.total_registrations.toLocaleString() : '—'}</span>
                    </div>
                    <div className="p-3 bg-[#FFF8FC] rounded-xl border border-[#F3DCE8]">
                      <span className="text-[#6B6470] text-[10px] block">Attendance Rate</span>
                      <span className="text-base font-bold text-[#A855F7]">{adminOverview ? adminOverview.total_certificates.toLocaleString() : '—'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* TAB 3: QUIZZES & XP */}
          {activeTab === 'quizzes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-[#18131A] font-outfit">
                  Technical Quizzes & Performance
                </h3>
              </div>

              <div className="space-y-3">
                {quizzes.map((quiz) => (
                  <GlassCard
                    key={quiz.id}
                    hoverEffect
                    className="p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-[#18131A]">{quiz.title}</h4>
                        <p className="text-xs text-[#6B6470]">
                          {quiz.eventTitle} · {quiz.totalQuestions} Questions · {quiz.timeLimitMinutes} Mins
                        </p>
                      </div>
                    </div>

                    <GradientButton
                      size="sm"
                      onClick={() => onOpenQuiz(quiz.id)}
                      icon={<Sparkles className="w-3.5 h-3.5" />}
                    >
                      Take Quiz ⚡
                    </GradientButton>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: USERS (FOR ADMIN) */}
          {activeTab === 'users' && user.role === 'admin' && (
            <div className="space-y-4 bg-white/90 p-6 rounded-3xl border border-[#F3DCE8]">
              <h3 className="text-lg font-extrabold text-[#18131A] font-outfit">
                Registered Campus Students (Management Table)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#F3DCE8] text-[#6B6470] uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5">Student</th>
                      <th className="py-2.5">Department</th>
                      <th className="py-2.5">Year</th>
                      <th className="py-2.5">Role</th>
                      <th className="py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3DCE8]/60">
                    {[
                      { name: 'Jithu Biju', email: 'jithubiju0102@gmail.com', dept: 'CSE', year: 'S5', role: 'Participant' },
                      { name: 'Aaditya Nair', email: 'aaditya@sbce.ac.in', dept: 'CSE', year: 'S7', role: 'Campus Lead' },
                      { name: 'Nandana Suresh', email: 'nandana@sbce.ac.in', dept: 'AI & DS', year: 'S5', role: 'Tech Lead' },
                      { name: 'Farhan Mohammed', email: 'farhan@sbce.ac.in', dept: 'ECE', year: 'S5', role: 'Design Lead' },
                      { name: 'Meera Krishnan', email: 'meera@sbce.ac.in', dept: 'CSE', year: 'S3', role: 'WIT Lead' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[#FFF8FC]">
                        <td className="py-3 font-semibold text-[#18131A]">
                          {row.name}
                          <span className="block text-[10px] font-normal text-[#6B6470]">{row.email}</span>
                        </td>
                        <td className="py-3 text-[#6B6470]">{row.dept}</td>
                        <td className="py-3 text-[#6B6470]">{row.year}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-[#DB2777] rounded-full">
                            {row.role}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button className="text-[11px] font-bold text-[#EC4899] hover:underline cursor-pointer">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Calendar & Recent Activity Feed (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Compact Monthly Calendar */}
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

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="font-bold text-[#6B6470] py-1">
                  {d}
                </span>
              ))}

              {/* Offset blanks */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <span key={`blank-${i}`} className="py-1.5 opacity-0" />
              ))}

              {/* Days in Month */}
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
                      if (eventsToday.length === 1) {
                        onSelectEvent(eventsToday[0].id);
                      } else if (eventsToday.length > 1) {
                        onSelectEvent(eventsToday[0].id);
                      }
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

            <div className="pt-2 border-t border-[#F3DCE8] flex items-center justify-between text-[10px] text-[#6B6470]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#EC4899]" /> Event Day
              </span>
              <span>Next: AI Workshop (Aug 31)</span>
            </div>
          </GlassCard>

          {/* Recent Activity Timeline Feed */}
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3DCE8]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#EC4899]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#18131A]">
                  Recent Activity
                </h4>
              </div>
              <span className="text-[10px] font-bold text-[#6B6470]">Real-time</span>
            </div>

            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1 text-xs">
              <p className="text-center text-[#6B6470] py-6">Nothing here yet.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
