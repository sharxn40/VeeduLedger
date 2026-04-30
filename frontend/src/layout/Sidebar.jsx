import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  Layers, 
  Users, 
  CreditCard, 
  FileText, 
  Receipt, 
  Settings,
  LayoutGrid,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { currentUser, userData } = useAuth();
  const ownerMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Buildings', path: '/buildings', icon: Building2 },
    { name: 'Units', path: '/units', icon: Layers },
    { name: 'Building Layout', path: '/layout', icon: LayoutGrid },
    { name: 'Tenants', path: '/tenants', icon: Users },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Bills', path: '/bills', icon: FileText },
    { name: 'Taxes', path: '/taxes', icon: Receipt },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const tenantMenuItems = [
    { name: 'Dashboard', path: '/tenant', icon: LayoutDashboard },
    { name: 'My Rent', path: '/tenant/payments', icon: CreditCard },
    { name: 'Utility Bills', path: '/tenant/bills', icon: FileText },
    { name: 'Settings', path: '/tenant/settings', icon: Settings },
  ];

  const menuItems = userData?.role === 'tenant' ? tenantMenuItems : ownerMenuItems;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#111827] text-white flex-col z-50 hidden md:flex">
      {/* Branding */}
      <Link to="/dashboard" className="p-6 block hover:opacity-80 transition-opacity">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Veedu<span className="text-blue-500">Ledger</span>
        </h1>
        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-medium">
          Track your property. Manage with clarity.
        </p>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {userData?.role === 'admin' && (
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 mb-4 border border-amber-500/20"
          >
            <ShieldCheck size={20} className="shrink-0" />
            <span className="font-bold text-sm">Admin Panel</span>
          </Link>
        )}
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
            `}
          >
            <item.icon size={20} className="shrink-0" />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold shrink-0">
            {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold truncate">
              {currentUser?.displayName || currentUser?.email?.split('@')[0]}
            </p>
            <p className="text-[10px] text-gray-500 truncate">{currentUser?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
