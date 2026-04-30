import React from 'react';
import { LogOut, Bell, Search, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser, userData } = useAuth();
  
  // Convert path to title
  const getPageTitle = () => {
    const segments = location.pathname.split('/');
    const path = segments[1];
    const subPath = segments[2];
    
    if (!path) return 'Dashboard';
    
    if (path === 'admin') {
      if (!subPath) return 'Admin Overview';
      const adminMap = {
        'users': 'User Management',
        'buildings': 'Global Buildings',
        'payments': 'Global Payments',
        'units': 'Global Units',
        'tenants': 'Global Tenants',
        'bills': 'Global Bills & Taxes'
      };
      return adminMap[subPath] || 'Admin Dashboard';
    }

    const titleMap = {
      'buildings': 'Properties',
      'units': 'Units',
      'layout': 'Building Layout',
      'tenants': 'Tenants',
      'payments': 'Payments',
      'bills': 'Utility Bills',
      'taxes': 'Taxes',
      'settings': 'Settings'
    };
    return titleMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-[64px] md:h-[70px] bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 backdrop-blur-md bg-white/80">
      <div className="flex items-center gap-4">
        {/* Mobile Branding (Show small V on mobile topbar) */}
        <div className="md:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/20 mr-2">
          V
        </div>
        
        <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">{getPageTitle()}</h2>
        
        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 ml-8 w-72 group focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-200 transition-all">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full placeholder:text-gray-400 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Notification Bell */}
        <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative group">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="hidden sm:block h-8 w-px bg-gray-100 mx-1"></div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* User Profile */}
          <div className="flex items-center gap-2 px-1 py-1 md:px-2 md:py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr ${userData?.role === 'admin' ? 'from-amber-500 to-orange-600' : 'from-blue-500 to-indigo-600'} flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/10 border-2 border-white`}>
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                (currentUser?.displayName || currentUser?.email)?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-black text-gray-900">
                {currentUser?.displayName || currentUser?.email?.split('@')[0]}
              </span>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                {userData?.role === 'admin' ? 'Administrator' : 'Manager'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={async () => {
              try {
                await logout();
                navigate('/login');
              } catch (err) {
                console.error("Logout failed", err);
              }
            }}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
