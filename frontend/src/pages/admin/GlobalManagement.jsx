import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Layers, 
  Users, 
  CreditCard, 
  FileText,
  Search,
  Loader2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const GlobalManagement = ({ initialTab = 'buildings' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'buildings', name: 'Buildings', icon: Building2 },
    { id: 'payments', name: 'Payments', icon: CreditCard },
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let result = [];
      if (activeTab === 'buildings') {
        result = await adminService.getGlobalBuildings();
      } else if (activeTab === 'payments') {
        result = await adminService.getGlobalPayments();
      }
      setData(result);
    } catch (err) {
      console.error(`Failed to fetch global ${activeTab}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    const search = searchTerm.toLowerCase();
    if (activeTab === 'buildings') return item.name?.toLowerCase().includes(search);
    if (activeTab === 'payments') return item.tenantName?.toLowerCase().includes(search) || item.status?.toLowerCase().includes(search);
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Data Management</h1>
          <p className="text-slate-500 font-medium">Global view and control of all system records.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`}
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <tab.icon size={18} />
            {tab.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-xl ${activeTab === 'buildings' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {activeTab === 'buildings' ? <Building2 size={24} /> : <CreditCard size={24} />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {activeTab === 'buildings' ? item.name : item.tenantName}
                      </h4>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          {activeTab === 'buildings' ? `Floors: ${item.totalFloors}` : `Status: ${item.status?.toUpperCase()}`}
                        </p>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">
                          Owner ID: {item.ownerId?.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {activeTab === 'payments' && (
                      <div className="text-right px-4 border-r border-slate-100 hidden md:block">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</p>
                        <p className="text-xl font-black text-slate-900">₹{item.amount?.toLocaleString()}</p>
                      </div>
                    )}
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
                      <ExternalLink size={20} />
                    </button>
                    <ChevronRight className="text-slate-300" size={20} />
                  </div>
                </div>
              ))}

              {filteredData.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium tracking-tight">No global {activeTab} data found.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default GlobalManagement;
