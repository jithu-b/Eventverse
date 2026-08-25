import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";

// Auth pages
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

// Dashboards
import ParticipantDashboard from "./pages/dashboard/ParticipantDashboard.jsx";
import OrganizerDashboard from "./pages/dashboard/OrganizerDashboard.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";

// Events
import EventList from "./pages/events/EventList.jsx";
import EventDetail from "./pages/events/EventDetail.jsx";
import EventForm from "./pages/events/EventForm.jsx";

// Quiz
import QuizAttempt from "./pages/quiz/QuizAttempt.jsx";
import QuizManage from "./pages/quiz/QuizManage.jsx";
import CalendarPage from "./pages/calendar/CalendarPage.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import GalleryPage from "./pages/gallery/GalleryPage.jsx";
import EventGalleryPage from "./pages/gallery/EventGalleryPage.jsx";
import ExecomPage from "./pages/execom/ExecomPage.jsx";
import QuizResults from "./pages/quiz/QuizResults.jsx";
import QuizLeaderboard from "./pages/quiz/QuizLeaderboard.jsx";

// Attendance
import QRScanner from "./pages/attendance/QRScanner.jsx";
import CheckInSuccess from "./pages/attendance/CheckInSuccess.jsx";


// Admin
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import ManageEvents from "./pages/admin/ManageEvents.jsx";
import ManageQuizzes from "./pages/admin/ManageQuizzes.jsx";
import Reports from "./pages/admin/Reports.jsx";


function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
            <AppLayout>
              <Routes>
                {/* Public / auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Public event browsing */}
                <Route path="/events" element={<EventList />} />
                <Route path="/events/:eventId" element={<EventDetail />} />

                {/* Dashboards (role-protected) */}
                <Route
                  path="/dashboard/participant"
                  element={
                    <ProtectedRoute roles={["participant"]}>
                      <ParticipantDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/organizer"
                  element={
                    <ProtectedRoute roles={["organizer", "admin"]}>
                      <OrganizerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Event management (Organizer/Admin) */}
                <Route
                  path="/events/new"
                  element={
                    <ProtectedRoute roles={["organizer", "admin"]}>
                      <EventForm mode="create" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events/:eventId/edit"
                  element={
                    <ProtectedRoute roles={["organizer", "admin"]}>
                      <EventForm mode="edit" />
                    </ProtectedRoute>
                  }
                />

                {/* Quiz */}
                <Route
                  path="/quiz/event/:eventId/manage"
                  element={
                    <ProtectedRoute roles={["organizer", "admin"]}>
                      <QuizManage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:quizId/attempt"
                  element={
                    <ProtectedRoute roles={["participant", "organizer", "admin"]}>
                      <QuizAttempt />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:quizId/results"
                  element={
                    <ProtectedRoute roles={["participant", "organizer", "admin"]}>
                      <QuizResults />
                    </ProtectedRoute>
                  }
                />
                <Route path="/quiz/:quizId/leaderboard" element={<QuizLeaderboard />} />

                {/* Calendar */}
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute roles={["participant", "organizer", "admin"]}>
                      <CalendarPage />
                    </ProtectedRoute>
                  }
                />
                {/* Attendance */}
                <Route
                  path="/attendance/scan"
                  element={
                    <ProtectedRoute roles={["participant", "organizer", "admin"]}>
                      <QRScanner />
                    </ProtectedRoute>
                  }
                />
                <Route path="/attendance/success" element={<CheckInSuccess />} />

                {/* Gallery */}
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/gallery/event/:eventId" element={<EventGalleryPage />} />

                {/* Execom */}
                <Route path="/execom" element={<ExecomPage />} />

                {/* Admin panel */}
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <ManageUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <ManageEvents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/quizzes"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <ManageQuizzes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <Reports />
                    </ProtectedRoute>
                  }
                />


                {/* Fallbacks */}
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/events" replace />} />
              </Routes>
            </AppLayout>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;