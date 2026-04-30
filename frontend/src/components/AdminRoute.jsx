import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = () => {
  const { currentUser, userData, loading } = useAuth();

  // Show loader while checking auth state and fetching role
  if (loading || (currentUser && !userData)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not an admin, redirect to normal dashboard
  if (userData?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // If admin, render the requested page
  return <Outlet />;
};

export default AdminRoute;
