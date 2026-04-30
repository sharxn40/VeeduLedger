import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Layers, 
  UserSquare2,
  CreditCard, 
  FileText, 
  LayoutDashboard,
  ArrowLeft
} from 'lucide-react';

const AdminSidebar = () => {
  const { currentUser, userData } = useAuth();
  
  const menuItems = [
    { name: 'Admin Overview', path: '/admin', icon: ShieldCheck, end: true },
    { name: 'User Management', path: '/admin/users', icon: UserSquare2 },
    { name: 'Global Buildings', path: '/admin/buildings', icon: Building2 },
    { name: 'Global Units', path: '/admin/units', icon: Layers },
    { name: 'Global Tenants', path: '/admin/tenants', icon: Users },
    { name: 'Global Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Global Bills & Taxes', path: '/admin/bills', icon: FileText },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#0F172A] text-white flex-col z-50 hidden md:flex">
      {/* Branding */}
      <div className="p-6 block">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-500" size={24} />
          <h1 className="text-xl font-bold tracking-tight text-white">
            Admin<span className="text-blue-500">Panel</span>
          </h1>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-medium">
          VeeduLedger Centralized Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon size={20} className="shrink-0" />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Back to User View */}
      <div className="px-4 py-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-amber-400 hover:bg-amber-400/10 transition-all font-medium text-sm"
        >
          <ArrowLeft size={20} />
          <span>User Dashboard</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
            {currentUser?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold truncate text-white">
              {userData?.email?.split('@')[0] || 'Admin'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{userData?.role?.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
