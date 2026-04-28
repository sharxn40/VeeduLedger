import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Home, 
  Users, 
  ArrowUpRight, 
  Loader2,
  PieChart,
  Activity,
  Calendar,
  AlertCircle,
  UserPlus,
  CreditCard,
  FileText,
  Clock,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const { stats, loading } = useDashboardData();
  const { settings } = useSettings();
  const currencySymbol = settings.currencySymbol || '₹';
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Revenue (MTD)', value: `${currencySymbol}${stats.revenueMTD.toLocaleString()}`, icon: Activity, 
      color: 'text-emerald-600', iconBg: 'bg-emerald-100', 
      cardBg: 'bg-gradient-to-br from-white to-emerald-50/80', border: 'border-emerald-100 shadow-emerald-100/50' 
    },
    { 
      label: 'Pending Rent', value: `${currencySymbol}${stats.pendingMTD.toLocaleString()}`, icon: AlertTriangle, 
      color: 'text-amber-600', iconBg: 'bg-amber-100', 
      cardBg: 'bg-gradient-to-br from-white to-amber-50/80', border: 'border-amber-100 shadow-amber-100/50' 
    },
    { 
      label: 'Occupied Units', value: `${stats.totalUnits - stats.vacantUnits}/${stats.totalUnits}`, icon: Home, 
      color: 'text-blue-600', iconBg: 'bg-blue-100', 
      cardBg: 'bg-gradient-to-br from-white to-blue-50/80', border: 'border-blue-100 shadow-blue-100/50' 
    },
    { 
      label: 'Total Tenants', value: stats.activeTenants, icon: Users, 
      color: 'text-purple-600', iconBg: 'bg-purple-100', 
      cardBg: 'bg-gradient-to-br from-white to-purple-50/80', border: 'border-purple-100 shadow-purple-100/50' 
    },
  ];

  const quickActions = [
    { label: 'Add Tenant', icon: UserPlus, path: '/tenants/add', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Record Rent', icon: CreditCard, path: '/payments', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Add Bill', icon: FileText, path: '/bills', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { label: 'Add Unit', icon: Home, path: '/units/add', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">Real-time performance metrics.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-bold text-gray-500">
          <Calendar size={16} />
          {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
      </motion.div>

      {/* Main Stats Grid - 2x2 on Mobile */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
      >
        {statCards.map((stat, i) => (
          <motion.div 
            key={i} 
            variants={item}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`card p-4 md:p-6 group transition-colors cursor-default shadow-sm md:shadow-lg ${stat.cardBg} ${stat.border}`}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-0">
              <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl w-fit ${stat.iconBg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon size={20} className="md:w-[22px] md:h-[22px]" />
              </div>
            </div>
            <div className="mt-3 md:mt-5">
              <span className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-widest block truncate">{stat.label}</span>
              <div className="text-xl md:text-3xl font-black text-gray-900 mt-0.5 md:mt-1 tracking-tight truncate">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions - 2x2 Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
      >
        {quickActions.map((action, i) => (
          <Link 
            key={i} 
            to={action.path}
            className={`card p-4 flex flex-col items-center justify-center text-center border ${action.border} hover:bg-gray-50 transition-all active:scale-95 group`}
          >
            <div className={`p-3 rounded-full mb-3 ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon size={20} />
            </div>
            <span className="text-xs md:text-sm font-bold text-gray-700">{action.label}</span>
          </Link>
        ))}
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Alerts & Activity Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6 md:space-y-8"
        >
          {/* Alerts Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <AlertCircle size={14} /> Attention Needed
            </h3>
            
            {stats.pendingMTD > 0 && (
              <div onClick={() => navigate('/payments')} className="card p-4 border border-amber-200 bg-amber-50/50 flex flex-row items-center gap-4 cursor-pointer hover:bg-amber-50 transition-colors">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm md:text-base font-bold text-amber-900">Pending Rent Collection</h4>
                  <p className="text-xs md:text-sm text-amber-700/80 font-medium mt-0.5">You have {currencySymbol}{stats.pendingMTD.toLocaleString()} in pending rent.</p>
                </div>
                <ChevronRight className="text-amber-400" size={20} />
              </div>
            )}

            {stats.unpaidBillsCount > 0 && (
              <div onClick={() => navigate('/bills')} className="card p-4 border border-rose-200 bg-rose-50/50 flex flex-row items-center gap-4 cursor-pointer hover:bg-rose-50 transition-colors">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm md:text-base font-bold text-rose-900">Unpaid Bills</h4>
                  <p className="text-xs md:text-sm text-rose-700/80 font-medium mt-0.5">You have {stats.unpaidBillsCount} unpaid bills requiring attention.</p>
                </div>
                <ChevronRight className="text-rose-400" size={20} />
              </div>
            )}

            {stats.vacantUnits > 0 && (
              <div onClick={() => navigate('/units')} className="card p-4 border border-blue-200 bg-blue-50/50 flex flex-row items-center gap-4 cursor-pointer hover:bg-blue-50 transition-colors">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Home size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm md:text-base font-bold text-blue-900">Vacant Units</h4>
                  <p className="text-xs md:text-sm text-blue-700/80 font-medium mt-0.5">You have {stats.vacantUnits} vacant units available.</p>
                </div>
                <ChevronRight className="text-blue-400" size={20} />
              </div>
            )}

            {stats.pendingMTD === 0 && stats.unpaidBillsCount === 0 && stats.vacantUnits === 0 && (
              <div className="card p-6 border border-emerald-100 bg-emerald-50/30 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <Activity size={24} />
                </div>
                <p className="text-sm font-bold text-emerald-800">All caught up! No urgent actions needed.</p>
              </div>
            )}
          </div>

        </motion.div>

        {/* Recent Activity Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
            <Clock size={14} /> Recent Activity
          </h3>
          
          <div className="card p-2">
            {stats.recentActivities && stats.recentActivities.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {stats.recentActivities.map((activity, index) => {
                  let Icon = Activity;
                  let colorClass = 'bg-gray-100 text-gray-600';
                  
                  if (activity.type === 'payment') {
                    Icon = CreditCard;
                    colorClass = 'bg-emerald-100 text-emerald-600';
                  } else if (activity.type === 'tenant') {
                    Icon = UserPlus;
                    colorClass = 'bg-blue-100 text-blue-600';
                  } else if (activity.type === 'bill') {
                    Icon = FileText;
                    colorClass = 'bg-purple-100 text-purple-600';
                  }

                  return (
                    <div key={activity.id || index} className="flex gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {activity.desc}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {activity.date ? new Date(activity.date).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : 'Recently'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No recent activity found.</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
