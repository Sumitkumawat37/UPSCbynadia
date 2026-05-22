import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { PurchaseProvider } from "@/lib/purchase-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { GoogleAuthProvider } from "@/lib/google-oauth-context";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import StudentDashboard from "./pages/StudentDashboard";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import NotesPage from "./pages/NotesPage";
import PersonalNotesPage from "./pages/PersonalNotesPage";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPlayPage from "./pages/QuizPlayPage";
import ResultsPage from "./pages/ResultsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import LiveClassesPage from "./pages/LiveClassesPage";
import DoubtsPage from "./pages/DoubtsPage";
import PYQsPage from "./pages/PYQsPage";
import CurrentAffairsPage from "./pages/CurrentAffairsPage";
import MainsWritingPage from "./pages/MainsWritingPage";
import StudyPlannerPage from "./pages/StudyPlannerPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminContent from "./pages/admin/AdminContent";
import AdminQuizzes from "./pages/admin/AdminQuizzes";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminLiveClasses from "./pages/admin/AdminLiveClasses";
import AdminDoubts from "./pages/admin/AdminDoubts";
import AdminCourseAccess from "./pages/admin/AdminCourseAccess";
import AdminEmailCenter from "./pages/admin/AdminEmailCenter";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SuperAdminUsers from "./pages/superadmin/SuperAdminUsers";
import CheckEmailPage from "./pages/CheckEmailPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Role-based root redirect
  const rootRedirect = role === "super_admin"
    ? "/superadmin"
    : role === "admin"
    ? "/admin"
    : "/";

  return (
    <AppLayout>
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={role === "super_admin" ? <Navigate to="/superadmin" replace /> : <HomePage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/courses/:courseId/lecture/:lectureId" element={<VideoPlayerPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/personal-notes" element={<PersonalNotesPage />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/quiz/:quizId" element={<QuizPlayPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/live-classes" element={<LiveClassesPage />} />
        <Route path="/doubts" element={<DoubtsPage />} />
        <Route path="/pyqs" element={<PYQsPage />} />
        <Route path="/current-affairs" element={<CurrentAffairsPage />} />
        <Route path="/mains-writing" element={<MainsWritingPage />} />
        <Route path="/study-planner" element={<StudyPlannerPage />} />

        {/* Admin (Teacher) Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/live" element={<AdminLiveClasses />} />
        <Route path="/admin/doubts" element={<AdminDoubts />} />
        <Route path="/admin/access" element={<AdminCourseAccess />} />
        <Route path="/admin/email-center" element={<AdminEmailCenter />} />

        {/* Super Admin Routes */}
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/users" element={<SuperAdminUsers />} />

        <Route path="/login" element={<Navigate to={rootRedirect} replace />} />
        <Route path="/signup" element={<Navigate to={rootRedirect} replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <PurchaseProvider>
          <GoogleAuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </GoogleAuthProvider>
        </PurchaseProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
