import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/sidebar/layout";
import Dashboard from "./components/dashboard/DashBoard";
import ReviewerPage from "./components/reviewer/ReviewerPage";
import ReviewerDetailPage from "./components/reviewer/ReviewerDetailPage";
import ProfilePage from "./components/profile/ProfilePage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ConfirmReset from "./components/auth/ConfirmReset";

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

          {/* Reviewer detail - without Layout (full screen) */}
          <Route path="/reviewer/:id" element={<ReviewerDetailPage />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;