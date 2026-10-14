import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Calendar,
  FileText, 
  Trophy, 
  Image as GalleryIcon, 
  Users, 
  Compass, 
  LayoutDashboard, 
  Award, 
  PlusCircle, 
  ShieldCheck, 
  UserCircle,
  CheckCircle2,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudentAuth } from '../../context/StudentAuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, NotificationItem, UserProfile } from '../../types';
import { GradientButton } from './GradientButton';
import { RedLogo } from './RedLogo';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, eventId?: string) => void;
  user?: UserProfile;
  userRole?: UserRole;
  onChangeRole?: (role: UserRole) => void;
  onRoleChange?: (role: UserRole) => void;
  notifications?: NotificationItem[];
  onOpenSearch?: () => void;
  onCreateEvent?: () => void;
  registeredCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  userRole,
  onChangeRole,
  onRoleChange,
  notifications = [],
  onOpenSearch = () => {},
  onCreateEvent = () => {},
  registeredCount,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { logout, authUser } = useAuth();
  const { student, logout: studentLogout } = useStudentAuth();
  const activeRole: UserRole = (authUser?.role as UserRole) || 'participant';

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadNotifs = safeNotifications.filter((n) => !n?.read);
  const totalRegistered = registeredCount !== undefined ? registeredCount : (user?.registeredEventIds?.length || 0);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'discover', label: 'Events', icon: Compass },
    { id: 'calendar', label: 'Calendar', icon: LayoutDashboard },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'gallery', label: 'Gallery', icon: GalleryIcon },
    { id: 'execom', label: 'Execom', icon: Users },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#141010] border-b border-[#2A2323] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Wordmark & Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo-btn"
          >
            <RedLogo className="w-10 h-10" />

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-outfit">
                  Event<span className="text-gradient-pink">Verse</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#3A1A1C] text-[#E04848] rounded-full border border-[#7A2020]">
                  SBCE
                </span>
              </div>
              <span className="hidden sm:inline text-[10px] font-medium tracking-wide text-[#B3ABAB]">
                TinkerHub Campus Chapter
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#141010] p-1.5 rounded-2xl border border-[#7A2020]">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer select-none ${
                    isActive
                      ? 'text-white'
                      : 'text-[#B8B0B0] hover:text-white hover:bg-[#B91C1C]/25'
                  }`}
                  id={`nav-link-${link.id}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-[#B91C1C] to-[#D32F2F] rounded-xl -z-10 shadow-sm shadow-red-600/25"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#B3ABAB]'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Create Event Button (for Organizer / Admin) */}
            {activeRole === 'admin' && (
              <button
                onClick={onCreateEvent}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#3A1A1C] hover:bg-[#4A2024] text-[#E04848] border border-[#7A2020] rounded-xl transition-all cursor-pointer"
                id="create-event-top-btn"
              >
                <PlusCircle className="w-4 h-4 text-[#E04848]" />
                <span>New Event</span>
              </button>
            )}

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 text-[#B8B0B0] hover:text-white bg-[#272424] hover:bg-[#332E2E] border border-[#3A3434] rounded-xl transition-all cursor-pointer shadow-xs"
                aria-label="Notifications"
                id="notifications-bell-btn"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold text-white bg-[#DC2626] rounded-full flex items-center justify-center animate-bounce shadow-xs">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1F1C1C] border border-[#3A3434] rounded-2xl shadow-xl shadow-red-600/10 p-4 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#3B3535]">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#E04848]" />
                        <h4 className="text-sm font-bold text-white">Campus Updates</h4>
                      </div>
                      <span className="text-xs font-medium text-[#E04848]">
                        {unreadNotifs.length} new
                      </span>
                    </div>

                    <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {safeNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-xl border text-xs transition-colors ${
                            notif.read
                              ? 'bg-white/5 border-white/10 text-[#B3ABAB]'
                              : 'bg-[#3A1A1C] border-[#7A2020] text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span className="text-[#E04848]">{notif.title}</span>
                            <span className="text-[10px] text-[#B3ABAB]">{notif.time}</span>
                          </div>
                          <p className="line-clamp-2">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* Profile Avatar Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 bg-[#272424] hover:bg-[#332E2E] border border-[#3A3434] rounded-2xl transition-all cursor-pointer shadow-xs"
                id="user-profile-btn"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#B91C1C] flex items-center justify-center text-white text-xs font-bold ring-2 ring-red-400/40">
                  {authUser?.name ? authUser.name.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="text-xs font-bold text-white hidden sm:inline">
                  {authUser?.name ? authUser.name.split(' ')[0] : ''}
                </span>
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    className="absolute right-0 mt-2 w-60 bg-[#1F1C1C] border border-[#3A3434] rounded-2xl shadow-xl shadow-red-600/10 p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-[#3B3535] mb-1">
                      <p className="text-xs font-bold text-white">{authUser?.name}</p>
                      <p className="text-[10px] text-[#B3ABAB]">{authUser?.email}</p>
                      <p className="text-[10px] text-[#E04848] font-semibold mt-0.5">SBCE</p>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('calendar');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-white hover:bg-[#141012] hover:text-[#E04848] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#E04848]" />
                      <span>Calendar</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('my-events');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-white hover:bg-[#141012] hover:text-[#E04848] rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#E04848]" />
                        <span>My Registered Events</span>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/15 text-[#E04848] rounded-full">
                        {totalRegistered}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('calendar');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-white hover:bg-[#141012] hover:text-[#E04848] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Award className="w-4 h-4 text-[#22D3EE]" />
                      <span>Certificates ({user?.certificates?.length || 3})</span>
                    </button>

                    <div className="my-1 border-t border-[#3B3535]" />

                    <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-[#B3ABAB]">
                      <span>Role:</span>
                      <span className="font-bold text-[#E04848] uppercase">{activeRole}</span>
                    </div>
                    <button
                      onClick={() => { logout(); studentLogout(); setProfileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-[#E04848] hover:bg-[#141012] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Nav Row - compact, single line, horizontally scrollable */}
      <div className="lg:hidden bg-[#141010] border-b border-[#2A2323] px-3 py-2 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {navLinks
            .filter((link) => link.id !== 'my-events')
            .map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#B91C1C] to-[#D32F2F] text-white shadow-sm'
                      : 'bg-transparent text-[#B8B0B0] hover:text-white border border-[#7A2020]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
        </div>
      </div>
    </header>
  );
};
