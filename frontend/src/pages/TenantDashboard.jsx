import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  FileText, 
  Clock, 
  Home, 
  AlertCircle,
  IndianRupee,
  ChevronRight,
  Loader2
} from 'lucide-react';

const TenantDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    nextRent: null,
    recentPayments: [],
    activeBills: []
  });

  useEffect(() => {
    const fetchTenantData = async () => {
      if (!currentUser) return;
      try {
        // In a real app, we would fetch the tenant document linked to this user
        // and then fetch related payments and bills.
        // For this demo, we'll try to find payments linked to the email or uid
        const paymentsRef = collection(db, "payments");
        const q = query(
          paymentsRef, 
          where("tenantId", "==", currentUser.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setDashboardData({
          nextRent: payments.find(p => p.status === 'pending') || null,
          recentPayments: payments.filter(p => p.status === 'paid'),
          activeBills: [] // Fetch from bills collection if needed
        });
      } catch (err) {
        console.error("Error fetching tenant dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Home</h1>
        <p className="text-slate-500 mt-1 font-medium">Everything you need for your stay.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Home size={120} />
            </div>
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-4">
                Current Status
              </span>
              
              {dashboardData.nextRent ? (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Next Rent Payment Due</h3>
                  <p className="text-slate-500 mb-6 font-medium">For the month of {dashboardData.nextRent.month}</p>
                  <div className="text-4xl font-black text-slate-900 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-400">₹</span>
                    {dashboardData.nextRent.amount?.toLocaleString()}
                  </div>
                  <button className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                    Pay Now
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 text-emerald-600 mb-4">
                    <div className="p-2 bg-emerald-50 rounded-full">
                      <Clock size={24} />
                    </div>
                    <h3 className="text-xl font-bold">All Rent Paid!</h3>
                  </div>
                  <p className="text-slate-500 font-medium">You are currently all caught up on your rent payments. Have a great day!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Recent Payments
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {dashboardData.recentPayments.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {dashboardData.recentPayments.map((payment) => (
                    <div key={payment.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Rent Payment - {payment.month}</p>
                          <p className="text-xs text-slate-500 font-medium">Paid via {payment.method || 'Online'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900">₹{payment.amount?.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(payment.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <CreditCard className="mx-auto text-slate-200 mb-3" size={48} />
                  <p className="text-slate-400 font-medium">No recent payment history.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Quick Info */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-900/10">
            <h3 className="text-lg font-bold mb-6">Need Help?</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Contact Manager</p>
                  <p className="text-xs text-slate-400 mt-0.5">Quick support for maintenance.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Lease Agreement</p>
                  <p className="text-xs text-slate-400 mt-0.5">View your contract terms.</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all border border-white/10">
              Go to Support
            </button>
          </div>

          {/* Active Bills */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Utility Bills</h3>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center py-4">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <FileText className="text-slate-300" size={24} />
                </div>
                <p className="text-sm text-slate-500 font-medium">No pending utility bills.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
