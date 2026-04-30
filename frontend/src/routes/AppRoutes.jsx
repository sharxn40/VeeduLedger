import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from '../layout/Layout';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Buildings from '../pages/Buildings';
import AddBuilding from '../pages/AddBuilding';
import Units from '../pages/Units';
import AddUnit from '../pages/AddUnit';
import Tenants from '../pages/Tenants';
import AddTenant from '../pages/AddTenant';
import TenantDetails from '../pages/TenantDetails';
import Payments from '../pages/Payments';
import BuildingLayout from '../pages/BuildingLayout';
import Bills from '../pages/Bills';
import Taxes from '../pages/Taxes';
import Settings from '../pages/Settings';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import PageTransition from '../components/ui/PageTransition';
import { useAuth } from '../context/AuthContext';

// Admin Pages
import AdminLayout from '../layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import GlobalManagement from '../pages/admin/GlobalManagement';

import TenantDashboard from '../pages/TenantDashboard';

const AppRoutes = () => {
  const location = useLocation();
  const { userData, currentUser, loading } = useAuth();

  // Root redirection logic
  if (location.pathname === '/' && currentUser && userData && !loading) {
    if (userData.role === 'admin') return <Navigate to="/admin" replace />;
    if (userData.role === 'tenant') return <Navigate to="/tenant" replace />;
    return <Navigate to="/dashboard" replace />; // Owner
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />

        {/* OWNER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['owner', 'admin']} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            
            {/* Buildings Management */}
            <Route path="/buildings" element={<PageTransition><Buildings /></PageTransition>} />
            <Route path="/buildings/add" element={<PageTransition><AddBuilding /></PageTransition>} />
            
            {/* Units Management */}
            <Route path="/units" element={<PageTransition><Units /></PageTransition>} />
            <Route path="/units/add" element={<PageTransition><AddUnit /></PageTransition>} />
            <Route path="/layout" element={<PageTransition><BuildingLayout /></PageTransition>} />

            {/* Tenant Management */}
            <Route path="/tenants" element={<PageTransition><Tenants /></PageTransition>} />
            <Route path="/tenants/add" element={<PageTransition><AddTenant /></PageTransition>} />
            <Route path="/tenants/:id" element={<PageTransition><TenantDetails /></PageTransition>} />

            {/* Financial Tracking */}
            <Route path="/payments" element={<PageTransition><Payments /></PageTransition>} />
            <Route path="/bills" element={<PageTransition><Bills /></PageTransition>} />
            <Route path="/taxes" element={<PageTransition><Taxes /></PageTransition>} />

            {/* Configuration */}
            <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
          </Route>
        </Route>

        {/* TENANT ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['tenant']} />}>
          <Route element={<Layout />}>
            <Route path="/tenant" element={<PageTransition><TenantDashboard /></PageTransition>} />
            <Route path="/tenant/payments" element={<PageTransition><Payments isTenantView={true} /></PageTransition>} />
            <Route path="/tenant/bills" element={<PageTransition><Bills isTenantView={true} /></PageTransition>} />
            <Route path="/tenant/settings" element={<PageTransition><Settings /></PageTransition>} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
            <Route path="/admin/users" element={<PageTransition><UserManagement /></PageTransition>} />
            <Route path="/admin/buildings" element={<PageTransition><GlobalManagement initialTab="buildings" /></PageTransition>} />
            <Route path="/admin/payments" element={<PageTransition><GlobalManagement initialTab="payments" /></PageTransition>} />
            <Route path="/admin/units" element={<PageTransition><GlobalManagement initialTab="units" /></PageTransition>} />
            <Route path="/admin/tenants" element={<PageTransition><GlobalManagement initialTab="tenants" /></PageTransition>} />
            <Route path="/admin/bills" element={<PageTransition><GlobalManagement initialTab="bills" /></PageTransition>} />
          </Route>
        </Route>

        {/* Default Redirect for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
