import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  Home, 
  Layers, 
  CreditCard as IndianRupee, 
  AlertCircle,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getGlobalStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Buildings', value: stats.buildings, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Total Units', value: stats.units, icon: Layers, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Tenants', value: stats.tenants, icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Control Center</h1>
        <p className="text-slate-500 mt-1 font-medium">Global system overview and analytics.</p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Financial Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <IndianRupee className="text-emerald-600" size={20} />
              Global Rent Collection (MTD)
            </h3>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Current Month</span>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collected Revenue</p>
                <p className="text-4xl font-black text-emerald-600">₹{stats.collectedMTD.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Dues</p>
                <p className="text-2xl font-bold text-amber-500">₹{stats.pendingMTD.toLocaleString()}</p>
              </div>
            </div>

            {/* Collection Bar */}
            <div className="pt-4">
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                <span>Progress</span>
                <span>{Math.round((stats.collectedMTD / (stats.collectedMTD + stats.pendingMTD || 1)) * 100)}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500" 
                  style={{ width: `${(stats.collectedMTD / (stats.collectedMTD + stats.pendingMTD || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            System Health
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase">Avg units/Owner</p>
              <p className="text-xl font-black text-slate-900 mt-1">{(stats.units / stats.users || 0).toFixed(1)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase">Occupancy Rate</p>
              <p className="text-xl font-black text-slate-900 mt-1">{Math.round((stats.tenants / stats.units || 0) * 100)}%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase">System Bills</p>
              <p className="text-xl font-black text-slate-900 mt-1">{stats.bills}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase">Total Payments</p>
              <p className="text-xl font-black text-slate-900 mt-1">{stats.payments}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
