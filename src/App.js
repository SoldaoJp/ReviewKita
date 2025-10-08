// src/App.js
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import ProtectedRoute from "./components/common/ProtectedRoute.js";
import RedirectIfAuthenticated from "./components/common/RedirectIfAuthenticated.js";
import Login from "./components/auth/Login";
import Signup from "./components/auth/signup";
import ProfilePage from "./components/profile/ProfilePage";
import Layout from "./components/sidebar/layout";
import ForgotPassword from "./components/auth/ForgotPassword";
import ConfirmReset from "./components/auth/ConfirmReset";
import ResetPassword from "./components/auth/ResetPassword";

// Reviewer pages
import ReviewerPage from "./components/reviewer/ReviewerPage";
import DataScalability from "./components/reviewer/DataScalability";
import QuantitativeMethods from "./components/reviewer/QuantitativeMethods";
import AdvancedDatabase from "./components/reviewer/AdvancedDatabase";
import Networking2 from "./components/reviewer/Networking2";
import AdvancedProgramming from "./components/reviewer/AdvancedProgramming";
import IAS from "./components/reviewer/IAS";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth pages - redirect if already authenticated */}
        <Route 
          path="/" 
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          } 
        />
        <Route 
          path="/login" 
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <RedirectIfAuthenticated>
              <Signup />
            </RedirectIfAuthenticated>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <RedirectIfAuthenticated>
              <ForgotPassword />
            </RedirectIfAuthenticated>
          } 
        />
        <Route 
          path="/confirm-reset" 
          element={
            <RedirectIfAuthenticated>
              <ConfirmReset />
            </RedirectIfAuthenticated>
          } 
        />
        <Route 
          path="/reset-password" 
          element={
            <RedirectIfAuthenticated>
              <ResetPassword />
            </RedirectIfAuthenticated>
          } 
        />

        {/* Protected Pages with Layout */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout><ProfilePage /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reviewer" 
          element={
            <ProtectedRoute>
              <Layout><ReviewerPage /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/datascalability" 
          element={
            <ProtectedRoute>
              <Layout><DataScalability /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quantitative-methods" 
          element={
            <ProtectedRoute>
              <Layout><QuantitativeMethods /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/advanced-database" 
          element={
            <ProtectedRoute>
              <Layout><AdvancedDatabase /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/networking-2" 
          element={
            <ProtectedRoute>
              <Layout><Networking2 /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/advanced-programming" 
          element={
            <ProtectedRoute>
              <Layout><AdvancedProgramming /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ias" 
          element={
            <ProtectedRoute>
              <Layout><IAS /></Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
