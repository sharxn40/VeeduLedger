import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Layers, 
  Users, 
  CreditCard,
  FileText,
  Receipt,
  LayoutGrid,
  Settings
} from 'lucide-react';

const BottomNav = () => {
  const containerRef = useRef(null);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Properties', path: '/buildings', icon: Building2 },
    { name: 'Units', path: '/units', icon: Layers },
    { name: 'Tenants', path: '/tenants', icon: Users },
    { name: 'Rent', path: '/payments', icon: CreditCard },
    { name: 'Bills', path: '/bills', icon: FileText },
    { name: 'Tax', path: '/taxes', icon: Receipt },
    { name: 'Layout', path: '/layout', icon: LayoutGrid },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  useEffect(() => {
    // Ensure the DOM has updated before scrolling
    const timeoutId = setTimeout(() => {
      if (containerRef.current) {
        const activeItem = containerRef.current.querySelector('.active-nav-item');
        if (activeItem) {
          activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
      <div 
        ref={containerRef}
        className="flex items-center px-4 py-3 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex items-center justify-start gap-2 w-max">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                  window.navigator.vibrate(50);
                }
              }}
              className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1 min-w-[72px] px-2 py-1 rounded-2xl transition-all duration-200 snap-center
                ${isActive ? 'active-nav-item text-blue-600 bg-blue-50/50 shadow-sm' : 'text-gray-400 hover:text-gray-600 active:scale-95'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[10px] font-black uppercase tracking-tight whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    {item.name}
                  </span>
                  {/* Active Indicator Dot */}
                  <div className={`w-1 h-1 rounded-full bg-blue-600 transition-all duration-300 mt-0.5 ${isActive ? 'scale-100' : 'scale-0'}`}></div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
