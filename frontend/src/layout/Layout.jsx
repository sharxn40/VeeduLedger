import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Responsive Sidebar (Visible on desktop only) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-[240px] flex flex-col pb-[80px] md:pb-0">
        <Topbar />
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Responsive Bottom Navigation (Visible on mobile only) */}
      <BottomNav />
    </div>
  );
};

export default Layout;
