import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Calendar, 
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
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, NotificationItem, UserProfile } from '../../types';
import { GradientButton } from './GradientButton';
import tinkerhubLogo from '../../assets/tinkerhub-logo.png';
import { AnimatedGuideMan } from '../character/AnimatedGuideMan';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { logout, authUser } = useAuth();
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'gallery', label: 'Gallery', icon: GalleryIcon },
    { id: 'execom', label: 'Execom', icon: Users },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Wordmark & Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo-btn"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EC4899] via-[#DB2777] to-[#A855F7] p-0.5 shadow-[0_0_10px_2px_rgba(255,255,255,0.35),0_0_14px_4px_rgba(236,72,153,0.18)] transition-transform duration-300 group-hover:scale-105">
              <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-[14px] flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0 rounded-[14px] shadow-[inset_0_0_10px_2px_rgba(255,255,255,0.55)] pointer-events-none" />
                <img
                  src={tinkerhubLogo}
                  alt="TinkerHub"
                  className="w-6 h-6 object-contain relative z-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                />
              </div>
            </div>

            <div className="w-12 h-12 hidden sm:block">
              <AnimatedGuideMan minimal characterName="Jithu" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#18131A] font-outfit">
                  Event<span className="text-gradient-pink">Verse</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#FFF1F7] text-[#DB2777] rounded-full border border-[#F3DCE8]">
                  SBCE
                </span>
              </div>
              <span className="hidden sm:inline text-[10px] font-medium tracking-wide text-[#6B6470]">
                TinkerHub Campus Chapter
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-[#F3DCE8]/80 shadow-xs">
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
                      : 'text-[#6B6470] hover:text-[#EC4899] hover:bg-pink-50/60'
                  }`}
                  id={`nav-link-${link.id}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-[#EC4899] to-[#A855F7] rounded-xl -z-10 shadow-sm shadow-pink-500/25"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6B6470]'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#6B6470] hover:text-[#EC4899] bg-white/80 hover:bg-pink-50/70 border border-[#F3DCE8] rounded-xl transition-all shadow-xs cursor-pointer"
              title="Search events (Ctrl+K)"
              id="global-search-trigger"
            >
              <Search className="w-4 h-4 text-[#EC4899]" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-[#6B6470] bg-[#FFF1F7] border border-[#F3DCE8] rounded">
                ⌘K
              </kbd>
            </button>

            {/* Create Event Button (for Organizer / Admin) */}
            {activeRole === 'admin' && (
              <button
                onClick={onCreateEvent}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#FFF1F7] hover:bg-pink-100 text-[#DB2777] border border-[#F3DCE8] rounded-xl transition-all cursor-pointer"
                id="create-event-top-btn"
              >
                <PlusCircle className="w-4 h-4 text-[#EC4899]" />
                <span>New Event</span>
              </button>
            )}

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 text-[#6B6470] hover:text-[#EC4899] bg-white/80 hover:bg-pink-50/70 border border-[#F3DCE8] rounded-xl transition-all cursor-pointer shadow-xs"
                aria-label="Notifications"
                id="notifications-bell-btn"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold text-white bg-[#EC4899] rounded-full flex items-center justify-center animate-bounce shadow-xs">
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
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-[#F3DCE8] rounded-2xl shadow-xl shadow-pink-500/10 p-4 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#F3DCE8]">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#EC4899]" />
                        <h4 className="text-sm font-bold text-[#18131A]">Campus Updates</h4>
                      </div>
                      <span className="text-xs font-medium text-[#DB2777]">
                        {unreadNotifs.length} new
                      </span>
                    </div>

                    <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {safeNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-xl border text-xs transition-colors ${
                            notif.read
                              ? 'bg-gray-50/50 border-gray-100 text-[#6B6470]'
                              : 'bg-[#FFF1F7]/80 border-[#F3DCE8] text-[#18131A]'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span className="text-[#DB2777]">{notif.title}</span>
                            <span className="text-[10px] text-[#6B6470]">{notif.time}</span>
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
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 bg-white/80 hover:bg-pink-50 border border-[#F3DCE8] rounded-2xl transition-all cursor-pointer shadow-xs"
                id="user-profile-btn"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#A855F7] flex items-center justify-center text-white text-xs font-bold ring-2 ring-pink-400/40">
                  {authUser?.name ? authUser.name.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="text-xs font-bold text-[#18131A] hidden sm:inline">
                  {authUser?.name ? authUser.name.split(' ')[0] : ''}
                </span>
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-xl border border-[#F3DCE8] rounded-2xl shadow-xl shadow-pink-500/10 p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-[#F3DCE8] mb-1">
                      <p className="text-xs font-bold text-[#18131A]">{authUser?.name}</p>
                      <p className="text-[10px] text-[#6B6470]">{authUser?.email}</p>
                      <p className="text-[10px] text-[#DB2777] font-semibold mt-0.5">SBCE</p>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-[#18131A] hover:bg-[#FFF1F7] hover:text-[#DB2777] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#EC4899]" />
                      <span>My Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-[#18131A] hover:bg-[#FFF1F7] hover:text-[#DB2777] rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#A855F7]" />
                        <span>My Registered Events</span>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-[#DB2777] rounded-full">
                        {totalRegistered}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-[#18131A] hover:bg-[#FFF1F7] hover:text-[#DB2777] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Award className="w-4 h-4 text-[#22D3EE]" />
                      <span>Certificates ({user?.certificates?.length || 3})</span>
                    </button>

                    <div className="my-1 border-t border-[#F3DCE8]" />

                    <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-[#6B6470]">
                      <span>Role:</span>
                      <span className="font-bold text-[#DB2777] uppercase">{activeRole}</span>
                    </div>
                    <button
                      onClick={() => { logout(); setProfileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-[#DB2777] hover:bg-[#FFF1F7] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#6B6470] hover:text-[#EC4899] bg-white/80 border border-[#F3DCE8] rounded-xl lg:hidden cursor-pointer"
              aria-label="Toggle menu"
              id="mobile-hamburger-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-[#F3DCE8] px-4 pt-2 pb-6 space-y-3 shadow-lg"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigate(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white shadow-sm'
                        : 'bg-[#FFF1F7] text-[#6B6470] hover:text-[#EC4899] border border-[#F3DCE8]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
