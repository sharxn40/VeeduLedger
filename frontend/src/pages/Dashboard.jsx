import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Home, 
  Users, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader2,
  PieChart,
  Activity,
  Calendar,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { stats, loading } = useDashboardData();
  const { settings } = useSettings();
  const currencySymbol = settings.currencySymbol || '₹';

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const statCards = [
    { label: 'Properties', value: stats.totalBuildings, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Units', value: stats.totalUnits, icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Tenants', value: stats.activeTenants, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Occupancy', value: `${stats.occupancyRate}%`, icon: PieChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Portfolio Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">Real-time performance metrics for your properties.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-bold text-gray-500">
          <Calendar size={16} />
          {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, i) => (
          <motion.div 
            key={i} 
            variants={item}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="card p-6 group hover:border-blue-200 transition-colors cursor-default shadow-lg shadow-gray-100/50"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon size={22} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                <ArrowUpRight size={10} />
                LIVE
              </div>
            </div>
            <div className="mt-5">
              <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
              <div className="text-3xl font-black text-gray-900 mt-1 tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Financial Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="card p-8 relative overflow-hidden border-none shadow-xl shadow-gray-100/50">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Activity size={120} className="text-blue-600" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              Collection Status (MTD)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
              <div className="space-y-2">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Revenue Collected</p>
                <div className="text-4xl font-black text-emerald-600 flex items-baseline gap-1 tracking-tight">
                  <span className="text-2xl font-bold">{currencySymbol}</span>
                  {stats.revenueMTD.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Payments Received
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Outstanding Dues</p>
                <div className="text-4xl font-black text-amber-500 flex items-baseline gap-1 tracking-tight">
                  <span className="text-2xl font-bold">{currencySymbol}</span>
                  {stats.pendingMTD.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                  Pending Collection
                </div>
              </div>
            </div>

            {/* Simple Progress Bar */}
            <div className="mt-10">
              <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                <span>Collection Progress</span>
                <span>{stats.revenueMTD + stats.pendingMTD > 0 
                  ? Math.round((stats.revenueMTD / (stats.revenueMTD + stats.pendingMTD)) * 100) 
                  : 0}% Collected</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.revenueMTD + stats.pendingMTD > 0 ? (stats.revenueMTD / (stats.revenueMTD + stats.pendingMTD)) * 100 : 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-emerald-500"
                ></motion.div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.revenueMTD + stats.pendingMTD > 0 ? (stats.pendingMTD / (stats.revenueMTD + stats.pendingMTD)) * 100 : 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  className="bg-amber-400 opacity-30"
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-8 border-dashed border-2 bg-gray-50/50 flex flex-col items-center justify-center text-center shadow-lg shadow-gray-100/30"
        >
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
          >
            <AlertCircle size={32} />
          </motion.div>
          <h4 className="text-lg font-bold text-gray-900 mb-2">Attention Needed</h4>
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
            You have <span className="font-bold text-gray-900">{stats.vacantUnits} vacant units</span> across your portfolio. Consider updating listings to maximize occupancy.
          </p>
          <button 
            onClick={() => window.location.href='/units'}
            className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95"
          >
            Manage Vacancies
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
