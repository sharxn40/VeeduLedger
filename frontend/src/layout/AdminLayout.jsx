import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar (Desktop only) */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-[240px] flex flex-col pb-[80px] md:pb-0">
        <Topbar isAdmin={true} />
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {/* We reuse existing BottomNav, maybe we should add an admin check there too */}
      <BottomNav />
    </div>
  );
};

export default AdminLayout;
