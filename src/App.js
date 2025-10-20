import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./user/controllers/AuthContext";
import LLMAnalytics from "./admin/views/LLMAnalytics";
import RecommendationModel from "./admin/views/RecommendationModel";
import QuizPage from "./user/views/reviewer/QuizPage";
import QuizHistoryPage from "./user/views/QuizHistoryPage";
import AnalyticsPage from "./user/views/analytics/AnalyticsPage";
import AdminDashboard from "./admin/views/Dashboard";
import AdminLlmConfigsView from "./admin/views/LlmConfigs";
import AdminProfile from "./admin/views/Profile";
import AdminUsersView from "./admin/views/Users";
import ConfirmReset from "./user/views/auth/ConfirmReset";
import ForgotPassword from "./user/views/auth/ForgotPassword";
import Login from "./user/views/auth/Login";
import ResetPassword from "./user/views/auth/ResetPassword";
import Signup from "./user/views/auth/signup";
import Dashboard from "./user/views/dashboard/DashBoard";
import ProfilePage from "./user/views/profile/ProfilePage";
import ReviewerDetailPage from "./user/views/reviewer/ReviewerDetailPage";
import ReviewerPage from "./user/views/reviewer/ReviewerPage";
import Layout from "./user/views/sidebar/layout";
import LLMReports from "./admin/views/LLMReports";
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
          <Route path="/analytics" element={<Layout><AnalyticsPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersView /></AdminRoute>} />
          <Route path="/admin/llm-configs" element={<AdminRoute><AdminLlmConfigsView /></AdminRoute>} />
          <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
          <Route path="/admin/recommendation-model" element={<AdminRoute><RecommendationModel /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><LLMAnalytics /></AdminRoute>} />
           <Route path="/llm-reports" element={<LLMReports />} />

          {/* Reviewer detail - without Layout (full screen) */}
          <Route path="/reviewer/:id" element={<ReviewerDetailPage />} />
          <Route path="/quiz/:reviewerId" element={<QuizPage />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;