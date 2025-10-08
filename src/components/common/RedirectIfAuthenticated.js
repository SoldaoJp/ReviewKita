// src/components/common/RedirectIfAuthenticated.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';

const RedirectIfAuthenticated = ({ children, redirectTo = '/profile' }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show loading spinner while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect authenticated users to profile page
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;