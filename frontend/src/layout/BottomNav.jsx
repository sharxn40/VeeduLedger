import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Layers, 
  Users, 
  CreditCard 
} from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Properties', path: '/buildings', icon: Building2 },
    { name: 'Units', path: '/units', icon: Layers },
    { name: 'Tenants', path: '/tenants', icon: Users },
    { name: 'Pay', path: '/payments', icon: CreditCard },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-3 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center gap-1 min-w-[64px] transition-all duration-200
            ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}
          `}
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-black uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                {item.name}
              </span>
              {/* Active Indicator Dot */}
              <div className={`w-1 h-1 rounded-full bg-blue-600 transition-all duration-300 mt-0.5 ${isActive ? 'scale-100' : 'scale-0'}`}></div>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
