import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./controllers/AuthContext";
import LLMAnalytics from "./components/admin/LLMAnalytics";
import RecommendationModel from "./components/admin/RecommendationModel";
import Flashcards from "./components/reviewer/Flashcards";
import IdentificationCard from "./components/reviewer/IdentificationCard";
import QuizPage from "./views/reviewer/QuizPage";
import QuizHistoryPage from "./views/QuizHistoryPage";
import AdminDashboard from "./views/admin/Dashboard";
import AdminLlmConfigsView from "./views/admin/LlmConfigs";
import AdminProfile from "./views/admin/Profile";
import AdminUsersView from "./views/admin/Users";
import ConfirmReset from "./views/auth/ConfirmReset";
import ForgotPassword from "./views/auth/ForgotPassword";
import Login from "./views/auth/Login";
import ResetPassword from "./views/auth/ResetPassword";
import Signup from "./views/auth/signup";
import Dashboard from "./views/dashboard/DashBoard";
import ProfilePage from "./views/profile/ProfilePage";
import ReviewerDetailPage from "./views/reviewer/ReviewerDetailPage";
import ReviewerPage from "./views/reviewer/ReviewerPage";
import Layout from "./views/sidebar/layout";
function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isAdmin?.() && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth routes - without Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/confirm-reset" element={<ConfirmReset />} />

          {/* Main app routes - with Layout (includes Sidebar) */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/reviewer" element={<Layout><ReviewerPage title="Reviewer" /></Layout>} />
          <Route path="/quiz-history" element={<Layout><QuizHistoryPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersView /></AdminRoute>} />
          <Route path="/admin/llm-configs" element={<AdminRoute><AdminLlmConfigsView /></AdminRoute>} />
          <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
          <Route path="/admin/recommendation-model" element={<AdminRoute><RecommendationModel /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><LLMAnalytics /></AdminRoute>} />

          {/* Reviewer detail - without Layout (full screen) */}
          <Route path="/reviewer/:id" element={<ReviewerDetailPage />} />
          <Route path="/quiz/:reviewerId" element={<QuizPage />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/identificationcard" element={<IdentificationCard />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;