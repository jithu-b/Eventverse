import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  EventItem, 
  UserProfile, 
  UserRole 
} from './types';
import { eventService } from './services/eventService';
import { eventApi } from './api/eventApi';
import { registrationApi } from './api/registrationApi';
import { useStudentAuth } from './context/StudentAuthContext';
import { StudentLoginModal } from './components/modals/StudentLoginModal';
import { adminApi } from './api/adminApi.js';
import { LivingBackground } from './components/common/LivingBackground';
import { ScrollProgressBar } from './components/execom/ScrollProgressBar';
import { ThemeProvider } from './components/execom/ThemeContext';
import { FloatingSparkles } from './components/execom/FloatingSparkles';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { EventDiscoveryPage } from './pages/EventDiscoveryPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { GalleryPage } from './pages/GalleryPage';
import { ExecomPage } from './pages/ExecomPage';
import { EventRegistrationModal } from './components/events/EventRegistrationModal';
import { QRScannerModal } from './components/events/QRScannerModal';
import { CreateEventModal } from './components/modals/CreateEventModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminPage } from './pages/AdminPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { STATIC_EVENTS } from './data/staticEvents';

function AppContent() {
  // Navigation View State
  type ViewType = 'home' | 'discover' | 'event-detail' | 'dashboard' | 'gallery' | 'execom' | 'admin' | 'my-events';

  const parseLocation = (): { view: ViewType; eventId: string | null } => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const validViews: ViewType[] = ['home', 'discover', 'event-detail', 'dashboard', 'gallery', 'execom', 'admin', 'my-events'];
    const view = (segments[0] as ViewType) || 'home';
    if (validViews.includes(view)) {
      return { view, eventId: segments[1] || null };
    }
    return { view: 'home', eventId: null };
  };

  const initialLocation = parseLocation();
  const [currentView, setCurrentView] = useState<ViewType>(initialLocation.view);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(initialLocation.eventId);
  const { authUser, loading } = useAuth();

  // App Data States
  const [events, setEvents] = useState<EventItem[]>([]);
  const [user, setUser] = useState<UserProfile>(eventService.getUser());
  const [activities, setActivities] = useState(eventService.getActivities());
  const [notifications, setNotifications] = useState(eventService.getNotifications());

  // Modal States
  const [activeRegEvent, setActiveRegEvent] = useState<EventItem | null>(null);
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const [pendingRegEvent, setPendingRegEvent] = useState<EventItem | null>(null);
  const { student } = useStudentAuth();
  const [activeQREvent, setActiveQREvent] = useState<EventItem | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    eventApi.list().then((evs) => { console.log('Fetched events:', evs); setEvents(evs); }).catch((err) => { console.error('List fetch failed:', err); setEvents(STATIC_EVENTS); });
    setUser(eventService.getUser());
    setActivities(eventService.getActivities());
    setNotifications(eventService.getNotifications());
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to top on navigation
  const handleNavigate = (view: string, eventId?: string) => {
    setCurrentView(view as any);
    if (eventId) {
      setSelectedEventId(eventId);
    }
    const path = eventId ? `/${view}/${eventId}` : view === 'home' ? '/' : `/${view}`;
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const loc = parseLocation();
      setCurrentView(loc.view);
      setSelectedEventId(loc.eventId);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Event Registration Flow
  const handleOpenRegistration = (eventId: string) => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return;
    if (!student) {
      setPendingRegEvent(evt);
      setShowStudentLogin(true);
      return;
    }
    setActiveRegEvent(evt);
  };

  const handleConfirmRegistration = async (
    eventId: string,
    details: { name: string; email: string; dept: string; year: string },
    responses?: Record<string, any>
  ) => {
    try {
      await registrationApi.register(eventId, details, responses);
      eventApi.list().then(setEvents);
      showToast(`Registered successfully for event! 🎟️`);
    } catch (err: any) {
      showToast(err?.message?.includes('duplicate') ? "You're already registered for this event." : 'Registration failed. Please try again.');
    }
  };

  // Bookmark Toggle
  const handleToggleBookmark = (eventId: string) => {
    eventService.toggleBookmark(eventId);
    const updatedUser = eventService.getUser();
    setUser({ ...updatedUser });
  };

  // QR Attendance Check-In Flow
  const handleOpenQRScanner = (eventToScan?: EventItem) => {
    const target = eventToScan || (selectedEventId ? events.find((e) => e.id === selectedEventId) : events[0]);
    if (target) {
      setActiveQREvent(target);
    }
  };

  const handleCheckInSuccess = (eventId: string) => {
    eventService.checkInAttendance(eventId, 'QR Scan');
    setUser(eventService.getUser());
    setActivities(eventService.getActivities());
    showToast(`Attendance verified & logged! ✅`);
  };


  // Role change
  const handleRoleChange = (role: UserRole) => {
    const updated = eventService.setUserRole(role);
    setUser({ ...updated });
    showToast(`Switched view to ${role.toUpperCase()} mode.`);
  };

  // Create Event
  const handleCreateEvent = (created: EventItem) => {
    setEvents((prev) => [created, ...prev]);
    showToast(`Event "${created.title}" published successfully! 🚀`);
    handleNavigate('event-detail', created.id);
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];


  if (loading) return null;


  return (
    <div className="min-h-screen relative flex flex-col font-sans text-[#18131A] selection:bg-pink-200 selection:text-[#DB2777]">
      {/* 1. Living Background Canvas */}
      <LivingBackground />
      <ScrollProgressBar />
      <FloatingSparkles />

      {/* 2. Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onCreateEvent={() => { if (authUser?.role === 'admin') setIsCreateEventOpen(true); else showToast('Only admins can create events. Please log in as admin.'); }}
        user={user}
        userRole={user.role}
        notifications={notifications}
        registeredCount={user.registeredEventIds?.length || 0}
        onRoleChange={handleRoleChange}
        onChangeRole={handleRoleChange}
      />

      {/* 3. Main Dynamic Content with Fluid Animated Transitions */}
      <main className="flex-1 w-full pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <HomePage
                user={user}
                events={events}
                onNavigate={handleNavigate}
                onRegisterEvent={handleOpenRegistration}
                registeredEventIds={user.registeredEventIds}
                bookmarkedEventIds={user.bookmarkedEventIds}
                onToggleBookmark={handleToggleBookmark}
                onCreateEvent={() => { if (authUser?.role === 'admin') setIsCreateEventOpen(true); else showToast('Only admins can create events. Please log in as admin.'); }}
              />
            </motion.div>
          )}

          {currentView === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <EventDiscoveryPage
                events={events}
                onSelectEvent={(id) => handleNavigate('event-detail', id)}
                onRegisterEvent={handleOpenRegistration}
                registeredEventIds={user.registeredEventIds}
                bookmarkedEventIds={user.bookmarkedEventIds}
                onToggleBookmark={handleToggleBookmark}
                onCreateEvent={() => { if (authUser?.role === 'admin') setIsCreateEventOpen(true); else showToast('Only admins can create events. Please log in as admin.'); }}
              />
            </motion.div>
          )}

          {currentView === 'event-detail' && selectedEvent && (
            <motion.div
              key={`detail-${selectedEvent.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <EventDetailPage
                event={selectedEvent}
                onBack={() => handleNavigate('discover')}
                onRegister={handleOpenRegistration}
                isRegistered={user.registeredEventIds.includes(selectedEvent.id)}
                isBookmarked={user.bookmarkedEventIds.includes(selectedEvent.id)}
                onToggleBookmark={handleToggleBookmark}
                onOpenQRScanner={() => handleOpenQRScanner(selectedEvent)}
                onDelete={authUser?.role === 'admin' ? async () => {
                  await eventApi.remove(selectedEvent.id);
                  setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
                  showToast('Event deleted');
                  handleNavigate('discover');
                } : undefined}
              />
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <DashboardPage
                user={user}
                events={events}
                activities={activities}
                onSelectEvent={(id) => handleNavigate('event-detail', id)}
                onOpenQRScanner={handleOpenQRScanner}
                onCreateEvent={() => { if (authUser?.role === 'admin') setIsCreateEventOpen(true); else showToast('Only admins can create events. Please log in as admin.'); }}
                onRoleChange={handleRoleChange}
              />
            </motion.div>
          )}

          {currentView === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <GalleryPage />
            </motion.div>
          )}

          {currentView === 'execom' && (
            <motion.div
              key="execom"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ExecomPage />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <AdminPage />
            </motion.div>
          )}

          {currentView === 'my-events' && (
            <motion.div
              key="my-events"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <MyRegistrationsPage
                events={events}
                onSelectEvent={(id) => handleNavigate('event-detail', id)}
                onRequestLogin={() => setShowStudentLogin(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. Global Modals */}
      {/* Event Registration & Digital Pass Modal */}
      <EventRegistrationModal
        isOpen={activeRegEvent !== null}
        onClose={() => setActiveRegEvent(null)}
        event={activeRegEvent}
        user={user}
        onConfirmRegistration={handleConfirmRegistration}
      />
      <StudentLoginModal
        isOpen={showStudentLogin}
        onClose={() => {
          setShowStudentLogin(false);
          setPendingRegEvent(null);
        }}
        onLoggedIn={() => {
          setShowStudentLogin(false);
          if (pendingRegEvent) {
            setActiveRegEvent(pendingRegEvent);
            setPendingRegEvent(null);
          }
        }}
      />

      {/* Live QR Scanner Modal */}
      <QRScannerModal
        isOpen={activeQREvent !== null}
        onClose={() => setActiveQREvent(null)}
        event={activeQREvent}
        onCheckInSuccess={handleCheckInSuccess}
      />

      {/* Organizer Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreated={handleCreateEvent}
      />

      {/* Global Spotlight Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        events={events}
        onSelectEvent={(id) => handleNavigate('event-detail', id)}
      />

      {/* Toast Notification Pill */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#18131A] text-white rounded-2xl shadow-xl flex items-center gap-2.5 border border-pink-500/30 text-xs font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
