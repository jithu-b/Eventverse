export type EventCategory = 
  | 'All'
  | 'Workshops' 
  | 'Hackathons' 
  | 'Competitions' 
  | 'Tech Talks' 
  | 'Social';

export type EventStatus = 'Upcoming' | 'Live' | 'Completed';

export type UserRole = 'participant' | 'organizer' | 'admin';

export interface Speaker {
  name: string;
  role: string;
  companyOrDept: string;
  avatar: string;
  bio?: string;
  socialUrl?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  speakerOrLead?: string;
  description: string;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  detailedAbout: string;
  category: 'Workshops' | 'Hackathons' | 'Competitions' | 'Tech Talks' | 'Social';
  status: EventStatus;
  date: string; // e.g. "31 AUG 2026"
  rawDate: string; // "2026-08-31"
  time: string; // e.g. "10:00 AM - 04:00 PM"
  location: string; // e.g. "SBCE Main Auditorium"
  locationDetails: string;
  bannerImage: string;
  thumbnail: string;
  totalSpots: number;
  registeredCount: number;
  registrationOpen: boolean;
  featured?: boolean;
  speakers: Speaker[];
  whatYouWillLearn: string[];
  prerequisites: string[];
  schedule: ScheduleItem[];
  tags: string[];
  quizId?: string;
  hasAttendance: boolean;
  hasCertificate: boolean;
  organizer: {
    name: string;
    role: string;
    avatar: string;
    contactEmail: string;
  };
  entryFee?: string; // "Free" or "₹99"
}

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  eventId: string;
  eventTitle: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  passingScore: number;
  questions: QuizQuestion[];
  activeStatus: boolean;
  participantAttemptsCount: number;
  topScore?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar: string;
  department: string;
  year: string;
  points: number;
  eventsAttended: number;
  quizzesWon: number;
  badges: string[];
  streak: number;
}

export interface Certificate {
  id: string;
  certificateCode: string;
  eventTitle: string;
  eventId: string;
  recipientName: string;
  recipientEmail: string;
  issueDate: string;
  category: string;
  verificationStatus: 'Verified' | 'Pending';
  credentialUrl: string;
  gradeOrRank?: string;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  status: 'Present' | 'Late' | 'Absent';
  method: 'QR Scan' | 'Manual Check-in' | 'Organizer Pass';
}

export interface ActivityItem {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'registration' | 'quiz' | 'certificate' | 'attendance' | 'event_created';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  subRole: string;
  department: string;
  year: string;
  bio: string;
  image: string;
  skills: string[];
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'event' | 'quiz' | 'certificate' | 'announcement';
  link?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  year: string;
  college: string;
  bio: string;
  registeredEventIds: string[];
  bookmarkedEventIds: string[];
  certificates: Certificate[];
  quizScores: { quizId: string; score: number; maxScore: number; date: string; passed: boolean }[];
  attendanceRecords: AttendanceRecord[];
}
