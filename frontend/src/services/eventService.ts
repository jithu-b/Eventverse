import { 
  EventItem, 
  Quiz, 
  LeaderboardEntry, 
  Certificate, 
  UserProfile, 
  NotificationItem, 
  ActivityItem, 
  UserRole,
  AttendanceRecord 
} from '../types';
import { 
  INITIAL_EVENTS, 
  INITIAL_QUIZZES, 
  INITIAL_LEADERBOARD, 
  INITIAL_CERTIFICATES, 
  INITIAL_USER, 
  INITIAL_NOTIFICATIONS, 
  RECENT_ACTIVITIES 
} from '../data/mockData';

const STORAGE_KEYS = {
  EVENTS: 'eventverse_events',
  QUIZZES: 'eventverse_quizzes',
  LEADERBOARD: 'eventverse_leaderboard',
  USER: 'eventverse_user',
  NOTIFICATIONS: 'eventverse_notifications',
  ACTIVITIES: 'eventverse_activities',
  ATTENDANCE: 'eventverse_attendance',
};

// Helper for local storage
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage error', err);
  }
}

export const eventService = {
  // Get all events
  getEvents: (): EventItem[] => {
    const list = getStored<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    return Array.isArray(list) && list.length > 0 ? list : INITIAL_EVENTS;
  },

  // Get single event
  getEventById: (id: string): EventItem | undefined => {
    const events = eventService.getEvents();
    return events.find((e) => e.id === id);
  },

  // Register for an event
  registerForEvent: (eventId: string, studentDetails?: { name: string; email: string; dept: string; year: string }): { success: boolean; event: EventItem; certificateCode?: string } => {
    const events = eventService.getEvents();
    const eventIndex = events.findIndex((e) => e.id === eventId);
    if (eventIndex === -1) throw new Error('Event not found');

    const event = events[eventIndex];
    const user = eventService.getUser();

    if (!Array.isArray(user.registeredEventIds)) {
      user.registeredEventIds = [];
    }

    // Check if already registered
    if (!user.registeredEventIds.includes(eventId)) {
      user.registeredEventIds.push(eventId);
      event.registeredCount = Math.min(event.totalSpots, (event.registeredCount || 0) + 1);
      events[eventIndex] = event;

      // Add activity
      eventService.addActivity({
        user: studentDetails?.name || user.name,
        userAvatar: user.avatar,
        action: 'registered for',
        target: event.title,
        type: 'registration'
      });

      // Add notification
      eventService.addNotification({
        title: `Registered: ${event.title} 🎟️`,
        message: `Your registration for ${event.title} is confirmed. Download your digital pass anytime.`,
        type: 'event'
      });

      setStored(STORAGE_KEYS.EVENTS, events);
      setStored(STORAGE_KEYS.USER, user);
    }

    return { success: true, event };
  },

  // Toggle bookmark
  toggleBookmark: (eventId: string): boolean => {
    const user = eventService.getUser();
    if (!Array.isArray(user.bookmarkedEventIds)) {
      user.bookmarkedEventIds = [];
    }
    const isBookmarked = user.bookmarkedEventIds.includes(eventId);
    if (isBookmarked) {
      user.bookmarkedEventIds = user.bookmarkedEventIds.filter((id) => id !== eventId);
    } else {
      user.bookmarkedEventIds.push(eventId);
    }
    setStored(STORAGE_KEYS.USER, user);
    return !isBookmarked;
  },

  // Create new event (Organizer/Admin)
  createEvent: (newEvent: Omit<EventItem, 'id' | 'registeredCount' | 'status'>): EventItem => {
    const events = eventService.getEvents();
    const id = newEvent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    
    const event: EventItem = {
      ...newEvent,
      id,
      registeredCount: 1,
      status: 'Upcoming',
    };

    events.unshift(event);
    setStored(STORAGE_KEYS.EVENTS, events);

    eventService.addActivity({
      user: event.organizer.name,
      userAvatar: event.organizer.avatar,
      action: 'published new event',
      target: event.title,
      type: 'event_created'
    });

    eventService.addNotification({
      title: `New Event Published 🚀`,
      message: `"${event.title}" is now open for campus registrations!`,
      type: 'announcement'
    });

    return event;
  },

  // Get quizzes
  getQuizzes: (): Quiz[] => {
    const list = getStored<Quiz[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    return Array.isArray(list) && list.length > 0 ? list : INITIAL_QUIZZES;
  },

  getQuizById: (quizId: string): Quiz | undefined => {
    const quizzes = eventService.getQuizzes();
    return quizzes.find((q) => q.id === quizId);
  },

  // Submit Quiz
  submitQuizScore: (quizId: string, scorePoints: number, maxPoints: number, timeSpentSeconds: number): { passed: boolean; score: number; rankPoints: number } => {
    const quizzes = eventService.getQuizzes();
    const quiz = quizzes.find((q) => q.id === quizId);
    const user = eventService.getUser();

    const percentage = Math.round((scorePoints / maxPoints) * 100);
    const passed = scorePoints >= (quiz?.passingScore ? quiz.passingScore * 20 : 60);

    if (!Array.isArray(user.quizScores)) {
      user.quizScores = [];
    }

    // Update user quiz history
    const existingIndex = user.quizScores.findIndex((qs) => qs.quizId === quizId);
    if (existingIndex >= 0) {
      user.quizScores[existingIndex] = {
        quizId,
        score: percentage,
        maxScore: 100,
        date: new Date().toISOString().split('T')[0],
        passed
      };
    } else {
      user.quizScores.push({
        quizId,
        score: percentage,
        maxScore: 100,
        date: new Date().toISOString().split('T')[0],
        passed
      });
    }

    // Award leaderboard points
    const earnedPoints = scorePoints * 5 + (passed ? 50 : 10);
    eventService.updateLeaderboardPoints(user.name, earnedPoints);

    // Issue certificate if passed
    if (passed && quiz) {
      const certCode = `TH-SBCE-${new Date().getFullYear()}-QZ${Math.floor(1000 + Math.random() * 9000)}`;
      const cert: Certificate = {
        id: `cert-q-${Date.now()}`,
        certificateCode: certCode,
        eventTitle: `${quiz.title} (Quiz Mastery)`,
        eventId: quiz.eventId,
        recipientName: user.name,
        recipientEmail: user.email,
        issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        category: 'Workshops',
        verificationStatus: 'Verified',
        credentialUrl: `https://eventverse.tinkerhub-sbce.org/verify/${certCode}`,
        gradeOrRank: percentage >= 90 ? 'High Distinction (Top 5%)' : 'Honor Certificate'
      };

      if (!Array.isArray(user.certificates)) {
        user.certificates = [];
      }

      // Add to user certificates if not already present
      if (!user.certificates.some((c) => c.eventTitle.includes(quiz.title))) {
        user.certificates.unshift(cert);
      }

      eventService.addNotification({
        title: `Quiz Certificate Earned! 🏆`,
        message: `Congratulations! You scored ${percentage}% on ${quiz.title} and earned a verified digital certificate.`,
        type: 'certificate'
      });
    }

    eventService.addActivity({
      user: user.name,
      userAvatar: user.avatar,
      action: `scored ${percentage}% on`,
      target: quiz?.title || 'Campus Quiz',
      type: 'quiz'
    });

    setStored(STORAGE_KEYS.USER, user);
    return { passed, score: percentage, rankPoints: earnedPoints };
  },

  // QR Attendance check-in simulation
  checkInAttendance: (eventId: string, method: 'QR Scan' | 'Manual Check-in' = 'QR Scan'): { success: boolean; message: string; record: AttendanceRecord } => {
    const user = eventService.getUser();
    const event = eventService.getEventById(eventId);
    if (!event) throw new Error('Event not found');

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      eventId,
      eventTitle: event.title,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      status: 'Present',
      method
    };

    if (!Array.isArray(user.attendanceRecords)) {
      user.attendanceRecords = [];
    }

    user.attendanceRecords.unshift(newRecord);
    setStored(STORAGE_KEYS.USER, user);

    eventService.addActivity({
      user: user.name,
      userAvatar: user.avatar,
      action: 'scanned QR Attendance for',
      target: event.title,
      type: 'attendance'
    });

    eventService.addNotification({
      title: 'Attendance Confirmed! ✅',
      message: `Your check-in for "${event.title}" has been successfully verified.`,
      type: 'event'
    });

    return {
      success: true,
      message: `Attendance marked successfully for ${event.title}`,
      record: newRecord
    };
  },

  // Leaderboard
  getLeaderboard: (): LeaderboardEntry[] => {
    const list = getStored<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
    return Array.isArray(list) && list.length > 0 ? list : INITIAL_LEADERBOARD;
  },

  updateLeaderboardPoints: (userName: string, additionalPoints: number): void => {
    const board = eventService.getLeaderboard();
    const entry = board.find((e) => e.userName.toLowerCase() === userName.toLowerCase());
    if (entry) {
      entry.points += additionalPoints;
      entry.quizzesWon += 1;
      entry.streak += 1;
    } else {
      board.push({
        rank: board.length + 1,
        userId: `u-${Date.now()}`,
        userName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        department: 'Computer Science & Engineering',
        year: 'S5',
        points: 1000 + additionalPoints,
        eventsAttended: 3,
        quizzesWon: 1,
        badges: ['Fast Learner', 'TinkerHub Builder'],
        streak: 1
      });
    }
    // Re-rank
    board.sort((a, b) => b.points - a.points);
    board.forEach((item, index) => {
      item.rank = index + 1;
    });
    setStored(STORAGE_KEYS.LEADERBOARD, board);
  },

  // User
  getUser: (): UserProfile => {
    const stored = getStored<UserProfile>(STORAGE_KEYS.USER, INITIAL_USER);
    return {
      ...INITIAL_USER,
      ...stored,
      registeredEventIds: Array.isArray(stored?.registeredEventIds) ? stored.registeredEventIds : INITIAL_USER.registeredEventIds,
      bookmarkedEventIds: Array.isArray(stored?.bookmarkedEventIds) ? stored.bookmarkedEventIds : INITIAL_USER.bookmarkedEventIds,
      certificates: Array.isArray(stored?.certificates) ? stored.certificates : INITIAL_USER.certificates,
      quizScores: Array.isArray(stored?.quizScores) ? stored.quizScores : INITIAL_USER.quizScores,
      attendanceRecords: Array.isArray(stored?.attendanceRecords) ? stored.attendanceRecords : INITIAL_USER.attendanceRecords,
      role: stored?.role || INITIAL_USER.role,
    };
  },

  setUserRole: (role: UserRole): UserProfile => {
    const user = eventService.getUser();
    user.role = role;
    setStored(STORAGE_KEYS.USER, user);
    return user;
  },

  updateUserProfile: (updates: Partial<UserProfile>): UserProfile => {
    const user = eventService.getUser();
    const updated = { ...user, ...updates };
    setStored(STORAGE_KEYS.USER, updated);
    return updated;
  },

  // Notifications
  getNotifications: (): NotificationItem[] => {
    const list = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return Array.isArray(list) ? list : INITIAL_NOTIFICATIONS;
  },

  addNotification: (item: Omit<NotificationItem, 'id' | 'time' | 'read'>): void => {
    const list = eventService.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false
    };
    list.unshift(newNotif);
    setStored(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  markNotificationsAsRead: (): void => {
    const list = eventService.getNotifications();
    list.forEach((n) => (n.read = true));
    setStored(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  // Activities
  getActivities: (): ActivityItem[] => {
    const list = getStored<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, RECENT_ACTIVITIES);
    return Array.isArray(list) ? list : RECENT_ACTIVITIES;
  },

  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>): void => {
    const list = eventService.getActivities();
    const newAct: ActivityItem = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: 'Just now'
    };
    list.unshift(newAct);
    if (list.length > 25) list.pop();
    setStored(STORAGE_KEYS.ACTIVITIES, list);
  }
};
