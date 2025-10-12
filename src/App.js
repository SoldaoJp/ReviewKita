import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./controllers/AuthContext";
import Layout from "./views/sidebar/layout";
import Dashboard from "./views/dashboard/DashBoard";
import ReviewerPage from "./views/reviewer/ReviewerPage";
import ReviewerDetailPage from "./views/reviewer/ReviewerDetailPage";
import ProfilePage from "./views/profile/ProfilePage";
import Login from "./views/auth/Login";
import Signup from "./views/auth/signup";
import ForgotPassword from "./views/auth/ForgotPassword";
import ResetPassword from "./views/auth/ResetPassword";
import ConfirmReset from "./views/auth/ConfirmReset";
import AdminUsersView from "./views/admin/Users";
import AdminLlmConfigsView from "./views/admin/LlmConfigs";
import AdminDashboard from "./views/admin/Dashboard";
import AdminProfile from "./views/admin/Profile";
import Flashcards from "./components/reviewer/Flashcards";
import IdentificationCard from "./components/reviewer/IdentificationCard";

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
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersView /></AdminRoute>} />
          <Route path="/admin/llm-configs" element={<AdminRoute><AdminLlmConfigsView /></AdminRoute>} />
          <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />

          {/* Reviewer detail - without Layout (full screen) */}
          <Route path="/reviewer/:id" element={<ReviewerDetailPage />} />
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